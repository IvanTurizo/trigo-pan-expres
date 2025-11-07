import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes, revenueRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("status", { count: "exact" }),
        supabase.from("orders").select("total"),
      ]);

      const pendingCount = ordersRes.data?.filter(o => o.status === "pending").length || 0;
      const revenue = revenueRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        pendingOrders: pendingCount,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Pedidos",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Pedidos Pendientes",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString("es-CO")} COP`,
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold mb-6">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bienvenido al Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Desde aquí puedes gestionar todos los productos y pedidos de tu panadería.
            Usa el menú lateral para navegar entre las diferentes secciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
