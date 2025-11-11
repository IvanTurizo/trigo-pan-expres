import { ShoppingCart, Menu, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onCartClick: () => void;
}

export const Header = ({ onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-foreground leading-tight">
                Trigo Pan Expres
              </h1>
              <p className="text-xs text-muted-foreground">Panadería y Repostería</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("menu")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Menú
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </button>
          </div>

          <div className="flex items-center gap-2">
            {user && isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="hidden sm:flex gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            
            {!user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden sm:flex gap-2"
              >
                <User className="h-4 w-4" />
                Ingresar
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
            <button
              onClick={() => scrollToSection("inicio")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("menu")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Menú
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </button>
            {user && isAdmin && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Panel Admin
              </button>
            )}
            {!user && (
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Ingresar
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
