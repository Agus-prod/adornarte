import { AttributeForm } from "@/components/products/forms/attribute-form";
import {
  deleteProductAttribute,
  updateProductAttribute,
} from "@/app/(dashboard)/inventario/productos/attribute-actions";
import type { ProductAttribute } from "@/lib/catalog/repositories/attribute-repository";

type Props = {
  productId: string;
  attributes: ProductAttribute[];
};

const labels: Record<string, string> = {
  color: "Color",
  tone: "Tono",
  finish: "Acabado",
  coverage: "Cobertura",
  spf: "SPF",
  size: "Tamaño",
  weight: "Peso",
  content: "Contenido",
  custom: "Dinámico",
};

function getTypeLabel(type: string) {
  return labels[type] ?? type;
}

export function ProductAttributesTable({
  productId,
  attributes,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
            <th className="p-4">
              Tipo
            </th>

            <th className="p-4">
              Nombre
            </th>

            <th className="p-4">
              Valor
            </th>

            <th className="p-4">
              Orden
            </th>

            <th className="p-4">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {attributes.map((attribute) => (
            <tr
              key={attribute.id}
              className="border-b align-top last:border-b-0"
            >
              <td className="p-4">
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                  {getTypeLabel(attribute.type)}
                </span>
              </td>

              <td className="p-4 font-medium">
                {attribute.name}
              </td>

              <td className="p-4">
                {attribute.value}
              </td>

              <td className="p-4">
                {attribute.sort_order}
              </td>

              <td className="p-4">
                <div className="flex flex-col gap-3">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Editar
                    </summary>

                    <div className="mt-4 min-w-[20rem] rounded-xl border bg-gray-50 p-4">
                      <AttributeForm
                        attribute={attribute}
                        submitLabel="Guardar atributo"
                        action={updateProductAttribute.bind(
                          null,
                          productId,
                          attribute.id
                        )}
                      />
                    </div>
                  </details>

                  <form
                    action={deleteProductAttribute.bind(
                      null,
                      productId,
                      attribute.id
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
