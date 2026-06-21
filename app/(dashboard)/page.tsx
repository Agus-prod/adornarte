import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/dashboard/get-dashboard-stats";

export default async function DashboardPage() {
  const stats =
    await getDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Productos"
        value={String(
          stats.totalProducts
        )}
      />

      <StatCard
        title="Stock Bajo"
        value={String(
          stats.lowStock
        )}
      />

      <StatCard
        title="Sin Stock"
        value={String(
          stats.outOfStock
        )}
      />

      <StatCard
        title="Valor Inventario"
        value={`L ${stats.inventoryValue.toFixed(
          2
        )}`}
      />
    </div>
  );
}