import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  const openWhatsApp = () => {
    const whatsappNumber = "573117643702";
    const message = "Hola, me gustaría hacer una consulta sobre sus productos.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="contacto" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-muted-foreground">
              Estamos aquí para atenderte
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Dirección</h3>
                  <p className="text-muted-foreground">
                    Cra. 19b #14a-2 a 14a-48<br />
                    Magangué, Bolívar<br />
                    Colombia
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Horario</h3>
                  <p className="text-muted-foreground">
                    Lunes a Domingo<br />
                    6:00 a.m. - 8:00 p.m.<br />
                    <span className="text-green-600 font-semibold">Abierto ahora</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Teléfono</h3>
                  <Button
                    onClick={openWhatsApp}
                    className="w-full"
                    size="lg"
                  >
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    info@trigopanexpres.com<br />
                    <span className="text-sm">Te respondemos en 24 horas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.8471948712287!2d-74.75485648477708!3d9.241659993441344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59a3f0d3f3f3f3%3A0x3f3f3f3f3f3f3f3f!2sMagangue%2C%20Bolivar%2C%20Colombia!5e0!3m2!1ses!2sco!4v1234567890"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
