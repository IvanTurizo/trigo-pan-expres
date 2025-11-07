import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
  is_active: boolean;
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group products by category
  const productsByCategory = {
    pan: products.filter(p => p.category === "pan"),
    pasteles: products.filter(p => p.category === "pasteles"),
    pasteleria: products.filter(p => p.category === "pasteleria"),
    bebidas: products.filter(p => p.category === "bebidas"),
  };
  if (loading) {
    return (
      <section id="menu" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

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

        <Tabs defaultValue="pan" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="pan" className="text-sm md:text-base">Panes</TabsTrigger>
            <TabsTrigger value="pasteles" className="text-sm md:text-base">Pasteles</TabsTrigger>
            <TabsTrigger value="pasteleria" className="text-sm md:text-base">Repostería</TabsTrigger>
            <TabsTrigger value="bebidas" className="text-sm md:text-base">Bebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="pan">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsByCategory.pan.length > 0 ? (
                productsByCategory.pan.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    description={product.description || undefined}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No hay productos disponibles en esta categoría
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pasteles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsByCategory.pasteles.length > 0 ? (
                productsByCategory.pasteles.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    description={product.description || undefined}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No hay productos disponibles en esta categoría
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pasteleria">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsByCategory.pasteleria.length > 0 ? (
                productsByCategory.pasteleria.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    description={product.description || undefined}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No hay productos disponibles en esta categoría
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bebidas">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsByCategory.bebidas.length > 0 ? (
                productsByCategory.bebidas.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    description={product.description || undefined}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No hay productos disponibles en esta categoría
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
