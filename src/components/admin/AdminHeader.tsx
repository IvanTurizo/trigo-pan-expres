import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-serif font-bold">Panel de Administración</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Ver Sitio</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </Button>
      </div>
    </header>
  );
};
