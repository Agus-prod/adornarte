import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SaleDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const { data: sale } =
    await supabase
      .from("sales")
      .select(`
        id,
        total,
        created_at
      `)
      .eq("id", id)
      .single();

  if (!sale) {
    notFound();
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Detalle de Venta
        </h1>

        <p className="mt-2 text-gray-500">
          Información completa de la venta.
        </p>
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

        {!items?.length ? (
          <p className="text-gray-500">
            No hay productos.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map(
              (item: any) => (
                <div
                  key={item.id}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    bg-gray-50
                    p-4
                  "
                >
                  <div>
                    <p className="font-semibold">
                      {item.products?.name ??
                        "-"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Cantidad:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <span className="font-bold">
                    L{" "}
                    {Number(
                      item.price
                    ).toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}