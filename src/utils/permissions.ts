import { supabase } from "@/integrations/supabase/client";

export const checkUserPermissions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) {
      console.error("Permission check error:", error.message);
      return { isAdmin: false, error: error.message };
    }

    const isAdmin = data?.some(role => role.role === "admin") || false;
    return { isAdmin, error: null };
  } catch (error) {
    console.error("Permission check failed:", error instanceof Error ? error.message : 'Unknown error');
    return { isAdmin: false, error: "Permission check failed" };
  }
};

export const ensureFirstUserIsAdmin = async (userId: string) => {
  try {
    // Check if any admin exists
    const { data: existingAdmins, error: adminCheckError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (adminCheckError) {
      console.error("Admin check error:", adminCheckError.message);
      return { success: false, error: adminCheckError.message };
    }

    // If no admins exist, make this user admin
    if (!existingAdmins || existingAdmins.length === 0) {
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (insertError) {
        console.error("Admin assignment error:", insertError.message);
        return { success: false, error: insertError.message };
      }

      return { success: true, madeAdmin: true };
    }

    return { success: true, madeAdmin: false };
  } catch (error) {
    console.error("Ensure admin failed:", error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: "Failed to ensure admin" };
  }
};