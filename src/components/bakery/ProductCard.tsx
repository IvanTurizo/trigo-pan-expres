import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export const ProductCard = ({ id, name, price, image, description }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    toast({
      title: "Producto agregado",
      description: `${name} se ha agregado al carrito`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        <p className="text-primary font-bold text-xl">
          ${price.toLocaleString("es-CO")} COP
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Agregar al pedido
        </Button>
      </CardFooter>
    </Card>
  );
};
