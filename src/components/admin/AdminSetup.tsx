import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { makeUserAdmin, checkUserRoles } from "@/utils/adminSetup";
import { toast } from "@/hooks/use-toast";

export const AdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  const handleMakeAdmin = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await makeUserAdmin(user.id);
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        // Reload the page to refresh auth context
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "No se pudo asignar el rol de administrador",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al asignar rol de administrador",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckRoles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await checkUserRoles(user.id);
      
      if (result.success) {
        setRoles(result.roles || []);
        toast({
          title: "Roles verificados",
          description: `Encontrados ${result.roles?.length || 0} roles`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al verificar roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Configuración de Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Parece que no tienes permisos de administrador. Usa los botones de abajo para configurar tu cuenta.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={handleMakeAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Procesando..." : "Hacerme Administrador"}
            </Button>
            
            <Button 
              onClick={handleCheckRoles} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Verificar Mis Roles
            </Button>
          </div>

          {roles.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">Roles actuales:</h4>
              <ul className="text-sm">
                {roles.map((role, index) => (
                  <li key={index} className="capitalize">
                    • {role.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Usuario ID: {user?.id}</p>
            <p>Email: {user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};