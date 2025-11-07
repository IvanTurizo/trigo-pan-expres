import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { OrderForm } from "./OrderForm";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleCheckout = () => {
    setShowOrderForm(true);
  };

  const handleOrderComplete = () => {
    clearCart();
    setShowOrderForm(false);
    onClose();
  };

  if (showOrderForm) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-serif">Finalizar Pedido</SheetTitle>
          </SheetHeader>
          <OrderForm
            items={items}
            total={total}
            onBack={() => setShowOrderForm(false)}
            onComplete={handleOrderComplete}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Tu Pedido</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mb-6">
              Agrega productos del menú para hacer tu pedido
            </p>
            <Button onClick={onClose}>Ver Menú</Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{item.name}</h4>
                  <p className="text-primary font-bold">
                    ${item.price.toLocaleString("es-CO")} COP
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold mb-6">
                <span>Total:</span>
                <span className="text-primary text-2xl">
                  ${total.toLocaleString("es-CO")} COP
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
              >
                Realizar Pedido
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
