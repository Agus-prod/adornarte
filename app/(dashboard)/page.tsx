import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Ventas Hoy"
        value="L 0.00"
      />

      <StatCard
        title="Productos"
        value="0"
      />

      <StatCard
        title="Clientes"
        value="0"
      />

      <StatCard
        title="Facturas"
        value="0"
      />
    </div>
  );
}