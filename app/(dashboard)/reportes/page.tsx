import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { SalesChart } from "@/components/reportes/sales-chart";

type Sale = {
  total: number;
  customers:
    | {
        name: string;
      }
    | null;
};

type SaleItem = {
  quantity: number;
  price: number;

  products:
    | {
        id: string;
        name: string;
        cost_price: number | null;
      }
    | {
        id: string;
        name: string;
        cost_price: number | null;
      }[]
    | null;
};

export default async function ReportesPage() {
  const profile =
    await getCurrentProfile();

    if (!profile) {
  throw new Error(
    "Usuario no autenticado"
  );
}

  const supabase =
    await createClient();

  const {
    data: salesData,
    error: salesError,
  } = await supabase
    .from("sales")
    .select(`
      total,
      created_at,
      customers (
        name
      )
    `)
    .eq(
  "organization_id",
  profile.organization_id
);

  if (salesError) {
    throw salesError;
  }

  const sales =
    (salesData ??
      []) as unknown as (Sale & {
      created_at?: string;
    })[];

  const totalSales =
    sales.length;

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total ?? 0
        ),
      0
    );

  const averageTicket =
    totalSales > 0
      ? totalRevenue /
        totalSales
      : 0;

  const chartMap =
    new Map<
      string,
      number
    >();

  sales.forEach(
    (sale) => {
      const day =
        sale.created_at
          ? new Date(
              sale.created_at
            ).toLocaleDateString()
          : "Sin fecha";

      chartMap.set(
        day,
        (chartMap.get(day) ??
          0) +
          Number(
            sale.total ?? 0
          )
      );
    }
  );

  const chartData =
    Array.from(
      chartMap.entries()
    ).map(
      ([name, total]) => ({
        name,
        total,
      })
    );

  const customerRanking =
    new Map<
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
        customerRanking.get(
          customerName
        ) ?? {
          purchases: 0,
          total: 0,
        };

      customerRanking.set(
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
      customerRanking.entries()
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

  const {
    data: saleItemsData,
    error: saleItemsError,
  } = await supabase
    .from("sale_items")
    .select(`
      quantity,
      price,
      products (
        id,
        name,
        cost_price
      )
    `);

  if (saleItemsError) {
    throw saleItemsError;
  }

  const saleItems =
    (saleItemsData ??
      []) as unknown as SaleItem[];

  let costOfGoods = 0;

  const productRanking =
    new Map<
      string,
      {
        name: string;
        quantity: number;
      }
    >();

  saleItems.forEach(
    (item) => {
      const product =
        Array.isArray(
          item.products
        )
          ? item.products[0]
          : item.products;

      if (!product) {
        return;
      }

      costOfGoods +=
        Number(
          product.cost_price ?? 0
        ) * item.quantity;

      const current =
        productRanking.get(
          product.id
        );

      if (current) {
        current.quantity +=
          item.quantity;
      } else {
        productRanking.set(
          product.id,
          {
            name:
              product.name,
            quantity:
              item.quantity,
          }
        );
      }
    }
  );

  const grossProfit =
    totalRevenue -
    costOfGoods;

  const profitMargin =
    totalRevenue > 0
      ? (
          (grossProfit /
            totalRevenue) *
          100
        ).toFixed(1)
      : "0.0";

  const topProducts =
    Array.from(
      productRanking.values()
    )
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Reportes
        </h1>

        <p className="mt-2 text-gray-500">
          Estadísticas del negocio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Ventas Totales
          </p>

          <p className="mt-2 text-3xl font-bold text-pink-600">
            L {totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Ventas
          </p>

          <p className="mt-2 text-3xl font-bold text-pink-600">
            {totalSales}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Ticket Promedio
          </p>

          <p className="mt-2 text-3xl font-bold text-pink-600">
            L {averageTicket.toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Costo Mercancía
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            L {costOfGoods.toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Ganancia Bruta
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            L {grossProfit.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {profitMargin}% margen
          </p>
        </div>
      </div>

      <SalesChart
        data={chartData}
      />
<div className="grid gap-6 xl:grid-cols-2">
  <div className="rounded-3xl border bg-white p-6 shadow-sm">
    <h2 className="mb-6 text-xl font-bold">
      👑 Top Clientes
    </h2>

    {!customers.length ? (
      <p className="text-gray-500">
        No hay ventas registradas.
      </p>
    ) : (
      <div className="space-y-3">
        {customers
          .slice(0, 10)
          .map(
            (
              customer,
              index
            ) => (
              <div
                key={customer.name}
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
                    {customer.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {
                      customer.purchases
                    } compras
                  </p>
                </div>

                <div className="font-bold text-pink-600">
                  L{" "}
                  {customer.total.toFixed(
                    2
                  )}
                </div>
              </div>
            )
          )}
      </div>
    )}
  </div>

  <div className="rounded-3xl border bg-white p-6 shadow-sm">
    <h2 className="mb-6 text-xl font-bold">
      📦 Top Productos
    </h2>

    {!topProducts.length ? (
      <p className="text-gray-500">
        No hay ventas registradas.
      </p>
    ) : (
      <div className="space-y-3">
        {topProducts.map(
          (
            product,
            index
          ) => (
            <div
              key={product.name}
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
                  {product.name}
                </p>
              </div>

              <div className="font-bold text-pink-600">
                {
                  product.quantity
                } unidades
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