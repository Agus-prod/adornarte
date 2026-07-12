import { getProducts } from "@/lib/products/get-products";

function money(value: number) {
  return `L ${value.toFixed(2)}`;
}

export default async function ContabilidadPage() {
  const products = await getProducts();

  const rows = products.map((product) => {
    const stock = product.stock ?? 0;
    const cost =
      Number(product.cost_price ?? 0) *
      stock;
    const sale =
      Number(product.sale_price ?? 0) *
      stock;

    return {
      id: product.id,
      name: product.name,
      stock,
      cost,
      sale,
      margin: sale - cost,
    };
  });

  const totalStock = rows.reduce(
    (sum, row) => sum + row.stock,
    0
  );
  const totalCost = rows.reduce(
    (sum, row) => sum + row.cost,
    0
  );
  const totalSale = rows.reduce(
    (sum, row) => sum + row.sale,
    0
  );
  const totalMargin =
    totalSale - totalCost;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contabilidad
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Resumen financiero del inventario activo.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Unidades
          </p>
          <p className="mt-2 text-3xl font-black">
            {totalStock}
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Costo inventario
          </p>
          <p className="mt-2 text-2xl font-black">
            {money(totalCost)}
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Venta estimada
          </p>
          <p className="mt-2 text-2xl font-black text-pink-600">
            {money(totalSale)}
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Utilidad potencial
          </p>
          <p className="mt-2 text-2xl font-black">
            {money(totalMargin)}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_6rem_9rem_9rem_9rem] gap-3 border-b bg-zinc-50 p-4 text-xs font-bold uppercase text-zinc-500">
          <span>Producto</span>
          <span className="text-right">
            Stock
          </span>
          <span className="text-right">
            Costo
          </span>
          <span className="text-right">
            Venta
          </span>
          <span className="text-right">
            Margen
          </span>
        </div>

        <div className="divide-y">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_6rem_9rem_9rem_9rem] gap-3 p-4 text-sm"
            >
              <p className="font-bold">
                {row.name}
              </p>
              <p className="text-right">
                {row.stock}
              </p>
              <p className="text-right">
                {money(row.cost)}
              </p>
              <p className="text-right text-pink-600">
                {money(row.sale)}
              </p>
              <p className="text-right font-bold">
                {money(row.margin)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
