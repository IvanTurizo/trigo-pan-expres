import { ProductCard } from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import breadImage from "@/assets/product-bread.jpg";
import cakeImage from "@/assets/product-cake.jpg";
import pastriesImage from "@/assets/product-pastries.jpg";
import beveragesImage from "@/assets/product-beverages.jpg";

const products = {
  panes: [
    { id: "p1", name: "Pan Francés", price: 1000, image: breadImage, description: "Pan crujiente recién horneado" },
    { id: "p2", name: "Pan Integral", price: 2000, image: breadImage, description: "Saludable y nutritivo" },
    { id: "p3", name: "Pan de Yuca", price: 1500, image: breadImage, description: "Tradicional colombiano" },
    { id: "p4", name: "Pan Mogolla", price: 1200, image: breadImage, description: "Suave y esponjoso" },
  ],
  pasteles: [
    { id: "c1", name: "Torta de Chocolate", price: 35000, image: cakeImage, description: "Deliciosa y húmeda" },
    { id: "c2", name: "Torta de Vainilla", price: 30000, image: cakeImage, description: "Clásica y elegante" },
    { id: "c3", name: "Torta de Zanahoria", price: 32000, image: cakeImage, description: "Con crema de queso" },
    { id: "c4", name: "Torta Tres Leches", price: 38000, image: cakeImage, description: "Suave y cremosa" },
  ],
  reposteria: [
    { id: "r1", name: "Pandebono", price: 1500, image: pastriesImage, description: "Tradicional y delicioso" },
    { id: "r2", name: "Buñuelos", price: 1200, image: pastriesImage, description: "Crujientes por fuera" },
    { id: "r3", name: "Almojábanas", price: 1300, image: pastriesImage, description: "Suaves y esponjosas" },
    { id: "r4", name: "Roscón", price: 2500, image: pastriesImage, description: "Dulce y aromático" },
  ],
  bebidas: [
    { id: "b1", name: "Café Americano", price: 2500, image: beveragesImage, description: "Café de alta calidad" },
    { id: "b2", name: "Café con Leche", price: 3000, image: beveragesImage, description: "Cremoso y suave" },
    { id: "b3", name: "Chocolate Caliente", price: 3500, image: beveragesImage, description: "Rico y espeso" },
    { id: "b4", name: "Jugo Natural", price: 4000, image: beveragesImage, description: "Fresco y natural" },
  ],
};

export const Products = () => {
  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestro Menú
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Productos frescos elaborados diariamente con ingredientes de primera calidad
          </p>
        </div>

        <Tabs defaultValue="panes" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="panes" className="text-sm md:text-base">Panes</TabsTrigger>
            <TabsTrigger value="pasteles" className="text-sm md:text-base">Pasteles</TabsTrigger>
            <TabsTrigger value="reposteria" className="text-sm md:text-base">Repostería</TabsTrigger>
            <TabsTrigger value="bebidas" className="text-sm md:text-base">Bebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="panes">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.panes.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pasteles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.pasteles.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reposteria">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.reposteria.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bebidas">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.bebidas.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
