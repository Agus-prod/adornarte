import { VariantForm } from "@/components/products/forms/variant-form";
import {
  deleteProductVariant,
  setDefaultProductVariant,
  updateProductVariant,
} from "@/app/(dashboard)/inventario/productos/variant-actions";
import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";

type Props = {
  productId: string;
  variants: ProductVariant[];
};

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

export function ProductVariantsTable({
  productId,
  variants,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
            <th className="p-4">
              Variante
            </th>

            <th className="p-4">
              SKU
            </th>

            <th className="p-4">
              Stock
            </th>

            <th className="p-4">
              Precio
            </th>

            <th className="p-4">
              Estado
            </th>

            <th className="p-4">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {variants.map((variant) => (
            <tr
              key={variant.id}
              className="border-b align-top last:border-b-0"
            >
              <td className="p-4">
                <div className="font-medium">
                  {variant.name}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {variant.barcode ?? "Sin código de barras"}
                </div>
              </td>

              <td className="p-4">
                {variant.sku ?? "-"}
              </td>

              <td className="p-4">
                {variant.stock}
              </td>

              <td className="p-4">
                {formatMoney(
                  variant.sale_price
                )}
              </td>

              <td className="p-4">
                <div className="flex flex-col gap-2">
                  {variant.active ? (
                    <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Activa
                    </span>
                  ) : (
                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      Inactiva
                    </span>
                  )}

                  {variant.is_default && (
                    <span className="w-fit rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                      Predeterminada
                    </span>
                  )}
                </div>
              </td>

              <td className="p-4">
                <div className="flex flex-col gap-3">
                  {!variant.is_default && (
                    <form
                      action={setDefaultProductVariant.bind(
                        null,
                        productId,
                        variant.id
                      )}
                    >
                      <button
                        type="submit"
                        className="text-sm font-medium text-pink-600 hover:text-pink-700"
                      >
                        Predeterminada
                      </button>
                    </form>
                  )}

                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Editar
                    </summary>

                    <div className="mt-4 min-w-[20rem] rounded-xl border bg-gray-50 p-4">
                      <VariantForm
                        variant={variant}
                        submitLabel="Guardar variante"
                        action={updateProductVariant.bind(
                          null,
                          productId,
                          variant.id
                        )}
                      />
                    </div>
                  </details>

                  <form
                    action={deleteProductVariant.bind(
                      null,
                      productId,
                      variant.id
                    )}
                  >
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 hover:text-red-700"
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
