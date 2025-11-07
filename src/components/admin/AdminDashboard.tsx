import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { ProductsManager } from "./ProductsManager";
import { OrdersManager } from "./OrdersManager";
import { DashboardStats } from "./DashboardStats";

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "orders">("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            {activeSection === "dashboard" && <DashboardStats />}
            {activeSection === "products" && <ProductsManager />}
            {activeSection === "orders" && <OrdersManager />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
