import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DebugAuth = () => {
  const { user, isAdmin, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const getDebugInfo = async () => {
      try {
        // Test connection
        const { data: connectionTest, error: connectionError } = await supabase
          .from("profiles")
          .select("count", { count: "exact", head: true });

        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        // Get user roles if user exists
        let userRoles = null;
        if (user) {
          const { data: roles, error: rolesError } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", user.id);
          userRoles = { roles, error: rolesError };
        }

        setDebugInfo({
          connection: { success: !connectionError, error: connectionError?.message },
          session: { exists: !!session, error: sessionError?.message },
          user: user ? { id: user.id, email: user.email } : null,
          isAdmin,
          loading,
          userRoles,
          localStorage: {
            isAdmin: localStorage.getItem('isAdmin')
          }
        });
      } catch (error) {
        setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    };

    getDebugInfo();
  }, [user, isAdmin, loading]);

  const createTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: "admin@test.com",
        password: "123456",
        options: {
          data: {
            full_name: "Admin Test"
          }
        }
      });

      if (error) {
        console.error("Error creating test user:", error);
        return;
      }

      console.log("Test user created:", data);
      
      // Make this user admin if successful
      if (data.user) {
        setTimeout(async () => {
          try {
            const { error: roleError } = await supabase
              .from("user_roles")
              .insert({
                user_id: data.user!.id,
                role: "admin"
              });
            
            if (roleError) {
              console.error("Error assigning admin role:", roleError);
            } else {
              console.log("Admin role assigned successfully");
            }
          } catch (err) {
            console.error("Error in role assignment:", err);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Debug Auth Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Button onClick={createTestUser} variant="outline" className="w-full">
              Crear Usuario Admin de Prueba
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Email: admin@test.com | Contraseña: 123456
            </p>
          </div>
          
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};