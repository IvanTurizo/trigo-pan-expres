import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CartItem } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const orderSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres"),
  email: z.string()
    .trim()
    .email("Debe ser un email válido")
    .max(100, "El email debe tener máximo 100 caracteres"),
  phone: z.string()
    .trim()
    .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
  address: z.string()
    .trim()
    .min(10, "La dirección debe ser más específica")
    .max(200, "La dirección debe tener máximo 200 caracteres"),
  notes: z.string()
    .max(500, "Las notas deben tener máximo 500 caracteres")
    .optional(),
  paymentMethod: z.enum(["efectivo", "transferencia"]),
});

interface OrderFormProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

export const OrderForm = ({ items, total, onBack, onComplete }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "efectivo",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación con zod
    const result = orderSchema.safeParse(formData);
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast({
        title: "Error de validación",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    const validatedData = result.data;
    setIsSubmitting(true);

    try {
      // Guardar pedido en la base de datos
      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: validatedData.name,
          customer_email: validatedData.email,
          customer_phone: validatedData.phone,
          delivery_address: validatedData.address,
          notes: validatedData.notes || null,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          total: total,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Crear mensaje para WhatsApp
      const itemsList = items
        .map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString("es-CO")} COP`)
        .join("\n");

      const message = `
🍞 *NUEVO PEDIDO - Trigo Pan Expres*
📋 *ID Pedido:* ${data.id.substring(0, 8)}

👤 *Cliente:* ${validatedData.name}
📧 *Email:* ${validatedData.email}
📱 *Teléfono:* ${validatedData.phone}
📍 *Dirección:* ${validatedData.address}

📦 *Productos:*
${itemsList}

💰 *Total:* $${total.toLocaleString("es-CO")} COP
💳 *Forma de pago:* ${validatedData.paymentMethod === "efectivo" ? "Efectivo" : "Transferencia"}

${validatedData.notes ? `📝 *Notas:* ${validatedData.notes}` : ""}
      `.trim();

      // Número de WhatsApp
      const whatsappNumber = "573117643702";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank");

      toast({
        title: "¡Pedido registrado!",
        description: "Tu pedido ha sido guardado y enviado por WhatsApp. Te contactaremos pronto.",
      });

      onComplete();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      toast({
        title: "Error al registrar pedido",
        description: "Hubo un problema al guardar tu pedido. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al carrito
      </Button>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Tu nombre"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="tu@email.com"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="300 123 4567"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección de entrega *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Calle, número, barrio..."
          required
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Instrucciones especiales para tu pedido..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-3">
        <Label>Forma de pago *</Label>
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          disabled={isSubmitting}
        >
          <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
            <RadioGroupItem value="efectivo" id="efectivo" disabled={isSubmitting} />
            <Label htmlFor="efectivo" className="cursor-pointer flex-1">
              Efectivo (pago contra entrega)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
            <RadioGroupItem value="transferencia" id="transferencia" disabled={isSubmitting} />
            <Label htmlFor="transferencia" className="cursor-pointer flex-1">
              Transferencia bancaria
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total a pagar:</span>
          <span className="text-primary text-2xl">
            ${total.toLocaleString("es-CO")} COP
          </span>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          "Enviar Pedido por WhatsApp"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al hacer clic en "Enviar Pedido", tu pedido será guardado y serás redirigido a WhatsApp para confirmar.
      </p>
    </form>
  );
};
