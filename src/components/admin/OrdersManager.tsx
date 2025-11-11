import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  items: OrderItem[] | Json;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  [key: string]: unknown;
}

const isOrderItemArray = (v: unknown): v is OrderItem[] => {
  return Array.isArray(v) && v.every(item => item && typeof (item as Record<string, unknown>).name === 'string');
}

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: "El estado del pedido se actualizó correctamente",
      });
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      completed: "Completado",
      cancelled: "Cancelado",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  const filteredOrders = orders.filter(o => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const itemsMatch = isOrderItemArray(o.items) && o.items.some(it => String(it.name).toLowerCase().includes(q));
    return (
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      String(o.customer_phone).toLowerCase().includes(q) ||
      itemsMatch
    );
  });

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold mb-6">Pedidos</h2>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No hay pedidos todavía. Los pedidos aparecerán aquí cuando los clientes
            realicen compras.
          </p>
        </Card>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="w-full sm:w-64">
              <input
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Buscar por cliente, email o producto..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Página {page} / {pageCount}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1}>Prev</Button>
                <Button size="sm" onClick={() => setPage(p => Math.min(pageCount, p+1))} disabled={page>=pageCount}>Next</Button>
              </div>
            </div>
          </div>
          <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      {order.delivery_address && (
                        <div className="text-xs text-muted-foreground">
                          {order.delivery_address}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.customer_email}</div>
                      <div className="text-muted-foreground">{order.customer_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                        {isOrderItemArray(order.items) ? (
                          order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity}x {item.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground">Sin detalle de items</div>
                        )}
                      </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${Number(order.total).toLocaleString("es-CO")} COP
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}
    </div>
  );
};
