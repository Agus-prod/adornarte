import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/dashboard/get-dashboard-stats";

export default async function DashboardPage() {
  const stats =
    await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Resumen general del negocio.
        </p>
      </div>

      <div
        className="
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-pink-500
          via-fuchsia-500
          to-purple-500
          p-8
          text-white
          shadow-xl
        "
      >
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-white/80">
            AdornArte
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Bienvenido 👋
          </h2>

          <p className="mt-3 text-white/90">
            Supervisa ventas e inventario desde un solo lugar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
              💰 Hoy: L{" "}
              {stats.salesTodayAmount.toFixed(
                2
              )}
            </div>

            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
              📅 Mes: L{" "}
              {stats.salesMonthAmount.toFixed(
                2
              )}
            </div>

            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
              🧾 Ventas:{" "}
              {stats.totalSales}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ventas Hoy"
          value={`L ${stats.salesTodayAmount.toFixed(
            2
          )}`}
        />

        <StatCard
          title="Ventas Mes"
          value={`L ${stats.salesMonthAmount.toFixed(
            2
          )}`}
        />

        <StatCard
          title="Total Ventas"
          value={String(
            stats.totalSales
          )}
        />

        <StatCard
          title="Valor Inventario"
          value={`L ${stats.inventoryValue.toFixed(
            2
          )}`}
        />
      </div>
    </div>
  );
}