import { supabase } from "@/integrations/supabase/client";

export const makeUserAdmin = async (userId: string) => {
  try {
    // Check if user already has admin role
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (existingRole) {
      return { success: true, message: "Usuario ya es administrador" };
    }

    // Add admin role
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "admin"
      });

    if (error) {
      throw error;
    }

    return { success: true, message: "Rol de administrador asignado" };
  } catch (error) {
    console.error("Error making user admin:", error);
    return { success: false, error };
  }
};

export const checkUserRoles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return { success: true, roles: data };
  } catch (error) {
    console.error("Error checking user roles:", error);
    return { success: false, error };
  }
};