import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, TrendingDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DailySales {
  date: string;
  ventas: number;
  pedidos: number;
}

interface ProductSales {
  name: string;
  cantidad: number;
  ingresos: number;
}

interface OrdersByStatus {
  name: string;
  value: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([]);
  const [showVentas, setShowVentas] = useState(true);
  const [showPedidos, setShowPedidos] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Cargar estadísticas básicas
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*"),
      ]);

      const orders = ordersRes.data || [];
      
      const pendingCount = orders.filter(o => o.status === "pending").length;
      const completedCount = orders.filter(o => o.status === "completed").length;
      const cancelledCount = orders.filter(o => o.status === "cancelled").length;
      const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        cancelledOrders: cancelledCount,
        totalRevenue: revenue,
        averageOrderValue: avgOrderValue,
      });

      // Calcular ventas por día (últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const salesByDay = last7Days.map(date => {
        const dayOrders = orders.filter(order => 
          order.created_at.startsWith(date)
        );
        return {
          date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
          ventas: dayOrders.reduce((sum, order) => sum + Number(order.total), 0),
          pedidos: dayOrders.length,
        };
      });
      setDailySales(salesByDay);

      // Calcular productos más vendidos
      const productSalesMap = new Map<string, { cantidad: number; ingresos: number }>();
      
      orders.forEach(order => {
        const items = order.items as any[];
        items.forEach(item => {
          const existing = productSalesMap.get(item.name) || { cantidad: 0, ingresos: 0 };
          productSalesMap.set(item.name, {
            cantidad: existing.cantidad + item.quantity,
            ingresos: existing.ingresos + (item.price * item.quantity),
          });
        });
      });

      const topProductsData = Array.from(productSalesMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
      
      setTopProducts(topProductsData);

      // Pedidos por estado
      setOrdersByStatus([
        { name: "Completados", value: completedCount },
        { name: "Pendientes", value: pendingCount },
        { name: "Preparando", value: orders.filter(o => o.status === "preparing").length },
        { name: "Enviados", value: orders.filter(o => o.status === "shipped").length },
        { name: "Cancelados", value: cancelledCount },
      ].filter(item => item.value > 0));

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
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Pedidos",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString("es-CO")}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Ticket Promedio",
      value: `$${Math.round(stats.averageOrderValue).toLocaleString("es-CO")}`,
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Completados",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pendientes",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
  
  const formatCurrency = (value: number) => `$${value.toLocaleString("es-CO")}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Dashboard Analítico</h2>
        <p className="text-muted-foreground">Vista general del rendimiento de tu panadería</p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfica de ventas diarias */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ventas de los Últimos 7 Días</CardTitle>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded text-sm ${showVentas ? 'bg-primary text-white' : 'bg-gray-100 text-muted-foreground'}`}
                  onClick={() => setShowVentas(s => !s)}
                >
                  Ventas
                </button>
                <button
                  className={`px-2 py-1 rounded text-sm ${showPedidos ? 'bg-primary text-white' : 'bg-gray-100 text-muted-foreground'}`}
                  onClick={() => setShowPedidos(s => !s)}
                >
                  Pedidos
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "ventas") return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                {showVentas && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Ventas (COP)"
                  />
                )}
                {showPedidos && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Número de Pedidos"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de pedidos por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Pedidos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Productos más vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "ingresos") return formatCurrency(value);
                  return `${value} unidades`;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" fill="#3b82f6" name="Cantidad Vendida" />
              <Bar yAxisId="right" dataKey="ingresos" fill="#10b981" name="Ingresos (COP)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights y recomendaciones */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.completedOrders > 0 && (
                <>Tasa de completación: <span className="font-bold text-green-600">
                  {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
                </span></>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.pendingOrders > 0 ? (
                <>Tienes <span className="font-bold text-orange-600">{stats.pendingOrders}</span> pedido(s) pendiente(s)</>
              ) : (
                <span className="text-green-600">No hay pedidos pendientes</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total de <span className="font-bold text-purple-600">{stats.totalProducts}</span> productos activos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
