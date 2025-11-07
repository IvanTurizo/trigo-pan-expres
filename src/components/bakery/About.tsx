import { Heart, Award, Clock } from "lucide-react";

export const About = () => {
  return (
    <section id="nosotros" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg text-muted-foreground">
              Más que una panadería, somos parte de tu familia
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground mb-12">
            <p className="text-lg leading-relaxed text-center">
              En <strong>Trigo Pan Expres</strong>, llevamos años compartiendo el sabor del pan
              recién horneado con las familias de Magangué. Nuestra pasión es crear productos
              de calidad utilizando recetas tradicionales y los mejores ingredientes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Con Amor</h3>
              <p className="text-muted-foreground">
                Cada producto es elaborado con dedicación y cariño para nuestros clientes
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Calidad Premium</h3>
              <p className="text-muted-foreground">
                Usamos solo ingredientes frescos y de la más alta calidad
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Siempre Frescos</h3>
              <p className="text-muted-foreground">
                Horneamos todos los días para garantizar la frescura de nuestros productos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
