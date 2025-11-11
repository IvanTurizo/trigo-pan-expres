import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem('isAdmin');
    return stored === 'true';
  });
  const [adminLoading, setAdminLoading] = useState(false);


  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role
        if (session?.user) {
          checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    setAdminLoading(true);
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      
      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      // Persist to localStorage
      localStorage.setItem('isAdmin', adminStatus.toString());
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
    } finally {
      setAdminLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }
      
      // Don't navigate here, let the auth state change handle it
      return { error: null };
    } catch (error) {
      console.error("Sign in catch error:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error("Sign up error:", error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Sign up catch error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    localStorage.setItem('isAdmin', 'false');
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
