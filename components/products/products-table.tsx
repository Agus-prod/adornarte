import Link from "next/link";
import { deleteProduct } from "@/app/(dashboard)/inventario/productos/actions";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  sale_price: number | null;
  stock: number | null;
  min_stock: number | null;

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
    <div
  className="
    overflow-hidden
    rounded-3xl
    border
    bg-white
    shadow-sm
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

              <td className="p-4">
                {product.categories?.name ??
                  "-"}
              </td>

              <td className="p-4">
                {product.brands?.name ??
                  "-"}
              </td>

<td className="p-4 font-medium text-gray-900">
  L {(product.sale_price ?? 0).toFixed(2)}
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
  px-3 py-1
  text-pink-600
  transition-all
  hover:bg-pink-100
"
    >
      Editar
    </Link>

    <form
  action={async () => {
    "use server";

    await deleteProduct(
      product.id
    );
  }}
>
  <button
    type="submit"
    className="
  rounded-lg
  px-3 py-1
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
  );
}