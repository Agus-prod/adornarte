import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/dashboard/get-dashboard-stats";
import { getTopProduct } from "@/lib/dashboard/get-top-product";

export default async function DashboardPage() {
  const stats =
    await getDashboardStats();

  const topProduct =
    await getTopProduct();

  const criticalProducts =
    [...stats.criticalProducts].sort(
      (a, b) => {
        const aStock =
          a.stock ?? 0;

        const bStock =
          b.stock ?? 0;

        if (
          aStock === 0 &&
          bStock > 0
        ) {
          return -1;
        }

        if (
          bStock === 0 &&
          aStock > 0
        ) {
          return 1;
        }

        return aStock - bStock;
      }
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
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
          p-6
          md:p-8
          text-white
          shadow-xl
        "
      >
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-white/80 md:text-sm">
            AdornArte
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-4xl">
            Bienvenido 👋
          </h2>

          <p className="mt-3 text-sm text-white/90 md:text-base">
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

      <div className="grid gap-6 xl:grid-cols-2">
        <div
          className="
            overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-yellow-400
            via-amber-400
            to-orange-500
            p-6
            text-white
            shadow-xl
          "
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              🏆
            </span>

            <h3 className="text-xl font-bold">
              Producto Más Vendido
            </h3>
          </div>

          {topProduct ? (
            <>
              <p className="mt-6 text-3xl font-bold">
                {topProduct.name}
              </p>

              <p className="mt-2 text-white/90">
                {topProduct.quantity} unidades vendidas
              </p>
            </>
          ) : (
            <p className="mt-6 text-white/90">
              Aún no hay ventas registradas.
            </p>
          )}
        </div>

        <div
          className="
            rounded-3xl
            border
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              ⚠️
            </span>

            <h3 className="text-xl font-bold">
              Inventario Crítico
            </h3>
          </div>

          {criticalProducts.length === 0 ? (
            <p className="mt-6 text-gray-500">
              No hay productos en riesgo.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {criticalProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      p-4
                    "
                  >
                    <div>
                      <p className="font-semibold">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Mínimo:{" "}
                        {product.min_stock ??
                          0}
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${
                          (product.stock ??
                            0) === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      Stock:{" "}
                      {product.stock ?? 0}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}