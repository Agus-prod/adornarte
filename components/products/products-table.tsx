import Link from "next/link";
import { deleteProductFromForm } from "@/app/(dashboard)/inventario/productos/actions";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  sale_price: number | null;
  stock: number | null;
  min_stock: number | null;
  is_featured?: boolean | null;

  categories?: {
    name: string;
  } | null;

  brands?: {
    name: string;
  } | null;
};

type Props = {
  products: Product[];
};

function getStockStatus(
  stock: number,
  minStock: number
) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
        Sin stock
      </span>
    );
  }

  if (stock <= minStock) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
        Stock bajo
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
      Disponible
    </span>
  );
}

export function ProductsTable({
  products,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        No hay productos registrados.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {product.categories?.name ?? "Sin categoria"} /{" "}
                  {product.brands?.name ?? "Sin marca"}
                </p>
              </div>
              {product.is_featured ? (
                <span
                  title="Producto destacado"
                  className="shrink-0 text-xl"
                >
                  *
                </span>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  Precio
                </p>
                <p className="mt-1 font-bold">
                  L {(product.sale_price ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  Stock
                </p>
                <p className="mt-1 font-bold">
                  {product.stock ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              {getStockStatus(
                product.stock ?? 0,
                product.min_stock ?? 0
              )}
              <div className="flex gap-2">
                <Link
                  href={`/inventario/productos/${product.id}/editar`}
                  className="rounded-xl bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700"
                >
                  Editar
                </Link>
                <form action={deleteProductFromForm}>
                  <input
                    type="hidden"
                    name="product_id"
                    value={product.id}
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="
          hidden
          overflow-hidden
          rounded-3xl
          border
          bg-white
          shadow-sm
          md:block
        "
      >
        <table className="w-full">
        <thead>
          <tr
            className="
              border-b
              bg-gray-50
              text-sm
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-center">
              ⭐
            </th>

            <th className="p-4 text-left">
              Categoría
            </th>

            <th className="p-4 text-left">
              Marca
            </th>

            <th className="p-4 text-left">
              Precio
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Estado
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="
                border-b
                transition-colors
                hover:bg-pink-50/40
              "
            >
              <td className="p-4 font-semibold">
                {product.name}
              </td>

              <td className="p-4 text-center">
                {product.is_featured ? (
                  <span
                    title="Producto destacado"
                    className="text-lg"
                  >
                    ⭐
                  </span>
                ) : (
                  <span className="text-gray-300">
                    —
                  </span>
                )}
              </td>

              <td className="p-4">
                {product.categories?.name ??
                  "-"}
              </td>

              <td className="p-4">
                {product.brands?.name ??
                  "-"}
              </td>

              <td className="p-4 font-medium text-gray-900">
                L{" "}
                {(
                  product.sale_price ?? 0
                ).toFixed(2)}
              </td>

              <td className="p-4">
                {product.stock ?? 0}
              </td>

              <td className="p-4">
                {getStockStatus(
                  product.stock ?? 0,
                  product.min_stock ?? 0
                )}
              </td>

              <td className="p-4">
                <div className="flex gap-3">
                  <Link
                    href={`/inventario/productos/${product.id}/editar`}
                    className="
                      rounded-lg
                      px-3
                      py-1
                      text-pink-600
                      transition-all
                      hover:bg-pink-100
                    "
                  >
                    Editar
                  </Link>

                  <form
                    action={deleteProductFromForm}
                  >
                    <input
                      type="hidden"
                      name="product_id"
                      value={product.id}
                    />

                    <button
                      type="submit"
                      className="
                        rounded-lg
                        px-3
                        py-1
                        text-red-600
                        transition-all
                        hover:bg-red-100
                      "
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
