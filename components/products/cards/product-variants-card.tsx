import { VariantForm } from "@/components/products/forms/variant-form";
import { ProductVariantsTable } from "@/components/products/tables/product-variants-table";
import { EmptyState } from "@/components/ui/empty-state";
import { createProductVariant } from "@/app/(dashboard)/inventario/productos/variant-actions";
import { getProductVariantsForEditor } from "@/lib/catalog/services/variant-service";

type Props = {
  productId: string;
};

export async function ProductVariantsCard({
  productId,
}: Props) {
  const variants =
    await getProductVariantsForEditor(
      productId
    );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Variantes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Administra tonos, colores, tallas y presentaciones con stock independiente.
          </p>
        </div>

        <details className="w-full md:w-auto">
          <summary className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-center font-medium text-white hover:bg-pink-700">
            Nueva variante
          </summary>

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 md:min-w-[36rem]">
            <VariantForm
              submitLabel="Crear variante"
              action={createProductVariant.bind(
                null,
                productId
              )}
            />
          </div>
        </details>
      </div>

      <div className="mt-6">
        {variants.length === 0 ? (
          <EmptyState
            title="Este producto no tiene variantes"
            description="Crea la primera variante para vender presentaciones, tonos o colores con stock propio."
          />
        ) : (
          <ProductVariantsTable
            productId={productId}
            variants={variants}
          />
        )}
      </div>
    </div>
  );
}
