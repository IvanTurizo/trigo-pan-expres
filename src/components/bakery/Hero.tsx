import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bakery.jpg";

export const Hero = () => {
  const scrollToMenu = () => {
    const element = document.getElementById("menu");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight animate-fade-in">
            Panadería y Repostería{" "}
            <span className="text-primary">Trigo Pan Expres</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            El sabor casero que alegra tus días
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pan fresco y repostería artesanal elaborados con amor y dedicación cada día.
            Descubre nuestros productos y haz tu pedido online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={scrollToMenu}
              className="text-lg px-8 py-6"
            >
              Ver Menú
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("contacto");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-lg px-8 py-6"
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};
