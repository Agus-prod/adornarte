import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type Sale = {
  total: number;
  customers:
    | {
        name: string;
      }
    | null;
};

export default async function ReportesPage() {
  const profile =
    await getCurrentProfile();

  const supabase =
    await createClient();

  const {
    data: salesData,
    error,
  } = await supabase
    .from("sales")
    .select(`
      total,
      customers (
        name
      )
    `)
    .eq(
      "organization_id",
      profile?.organization_id
    );

  if (error) {
    throw error;
  }

  const sales =
    (salesData ??
      []) as unknown as Sale[];

  const ranking = new Map<
    string,
    {
      purchases: number;
      total: number;
    }
  >();

  sales.forEach(
    (sale) => {
      const customerName =
        sale.customers?.name ??
        "Consumidor Final";

      const current =
        ranking.get(
          customerName
        ) ?? {
          purchases: 0,
          total: 0,
        };

      ranking.set(
        customerName,
        {
          purchases:
            current.purchases + 1,
          total:
            current.total +
            Number(
              sale.total ?? 0
            ),
        }
      );
    }
  );

  const customers =
    Array.from(
      ranking.entries()
    )
      .map(
        ([name, stats]) => ({
          name,
          ...stats,
        })
      )
      .sort(
        (a, b) =>
          b.total - a.total
      );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Reportes
        </h1>

        <p className="mt-2 text-gray-500">
          Ranking de clientes.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">
          🏆 Clientes con Más Compras
        </h2>

        {!customers.length ? (
          <p className="text-gray-500">
            No hay ventas registradas.
          </p>
        ) : (
          <div className="space-y-3">
            {customers.map(
              (
                customer,
                index
              ) => (
                <div
                  key={
                    customer.name
                  }
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
                      #{index + 1}{" "}
                      {
                        customer.name
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {
                        customer.purchases
                      }{" "}
                      compras
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-pink-600">
                      L{" "}
                      {customer.total.toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}