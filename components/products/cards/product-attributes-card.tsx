import { AttributeForm } from "@/components/products/forms/attribute-form";
import { ProductAttributesTable } from "@/components/products/tables/product-attributes-table";
import { EmptyState } from "@/components/ui/empty-state";
import { createProductAttribute } from "@/app/(dashboard)/inventario/productos/attribute-actions";
import { getProductAttributesForEditor } from "@/lib/catalog/services/attribute-service";

type Props = {
  productId: string;
};

export async function ProductAttributesCard({
  productId,
}: Props) {
  const attributes =
    await getProductAttributesForEditor(
      productId
    );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Atributos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Administra color, tono, acabado, cobertura, SPF, tamaño, peso, contenido y atributos dinámicos.
          </p>
        </div>

        <details className="w-full md:w-auto">
          <summary className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-center font-medium text-white hover:bg-pink-700">
            Nuevo atributo
          </summary>

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 md:min-w-[36rem]">
            <AttributeForm
              submitLabel="Crear atributo"
              action={createProductAttribute.bind(
                null,
                productId
              )}
            />
          </div>
        </details>
      </div>

      <div className="mt-6">
        {attributes.length === 0 ? (
          <EmptyState
            title="Este producto no tiene atributos"
            description="Crea atributos para describir tonos, colores, acabados o características dinámicas."
          />
        ) : (
          <ProductAttributesTable
            productId={productId}
            attributes={attributes}
          />
        )}
      </div>
    </div>
  );
}
