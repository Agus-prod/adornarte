import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/ventas/print-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Sale = {
  id: string;
  total: number;
  created_at: string;

  customers:
    | {
        name: string;
      }
    | null;
};

type SaleItem = {
  id: string;
  quantity: number;
  price: number;
  products:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export default async function SaleDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const {
    data: saleData,
    error: saleError,
  } = await supabase
    .from("sales")
    .select(`
      id,
      total,
      created_at,
      customers (
        name
      )
    `)
    .eq("id", id)
    .single();

  if (saleError || !saleData) {
    notFound();
  }

  const sale =
    saleData as unknown as Sale;

  const {
    data: items,
  } = await supabase
    .from("sale_items")
    .select(`
      id,
      quantity,
      price,
      products (
        name
      )
    `)
    .eq("sale_id", id);

  const saleItems =
    (items ?? []) as unknown as SaleItem[];

  const totalUnits =
    saleItems.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Detalle de Venta
          </h1>

          <p className="mt-2 text-gray-500">
            Información completa de la venta.
          </p>
        </div>

        <PrintButton />
      </div>

      <div
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/80
          p-6
          shadow-sm
          backdrop-blur-xl
        "
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>ID</span>

            <span className="font-medium">
              {sale.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Fecha</span>

            <span>
              {new Date(
                sale.created_at
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Cliente</span>

            <span>
              {sale.customers?.name ??
                "Consumidor Final"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>

            <span className="text-xl font-bold text-pink-600">
              L{" "}
              {Number(
                sale.total
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/80
          p-6
          shadow-sm
          backdrop-blur-xl
        "
      >
        <h2 className="mb-4 text-lg font-semibold">
          Productos Vendidos
        </h2>

        {!saleItems.length ? (
          <p className="text-gray-500">
            No hay productos.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {saleItems.map(
                (item) => {
                  const subtotal =
                    item.quantity *
                    Number(
                      item.price
                    );

                  return (
                    <div
                      key={item.id}
                      className="
                        rounded-2xl
                        border
                        bg-gray-50
                        p-4
                      "
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {Array.isArray(
                              item.products
                            )
                              ? item
                                  .products[0]
                                  ?.name ??
                                "-"
                              : item
                                  .products
                                  ?.name ??
                                "-"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Cantidad:{" "}
                            {
                              item.quantity
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            Precio unitario:
                            {" "}
                            L{" "}
                            {Number(
                              item.price
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Subtotal
                          </p>

                          <p className="text-lg font-bold text-pink-600">
                            L{" "}
                            {subtotal.toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="mb-3 flex justify-between text-sm text-gray-500">
                <span>
                  Productos distintos
                </span>

                <span>
                  {
                    saleItems.length
                  }
                </span>
              </div>

              <div className="mb-6 flex justify-between text-sm text-gray-500">
                <span>
                  Unidades vendidas
                </span>

                <span>
                  {totalUnits}
                </span>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-pink-500
                  to-fuchsia-500
                  p-5
                  text-white
                "
              >
                <p className="text-sm uppercase tracking-widest text-white/80">
                  Total de la Venta
                </p>

                <p className="mt-2 text-4xl font-bold">
                  L{" "}
                  {Number(
                    sale.total
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}