import { ImageForm } from "@/components/products/forms/image-form";
import {
  deleteProductImage,
  setPrimaryProductImage,
  updateProductImage,
} from "@/app/(dashboard)/inventario/productos/image-actions";
import type { ProductImage } from "@/lib/catalog/repositories/image-repository";

type Props = {
  productId: string;
  images: ProductImage[];
};

export function ProductImagesTable({
  productId,
  images,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
            <th className="p-4">
              Imagen
            </th>

            <th className="p-4">
              Orden
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
          {images.map((image) => (
            <tr
              key={image.id}
              className="border-b align-top last:border-b-0"
            >
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={image.url}
                    alt={image.alt_text ?? ""}
                    className="h-20 w-20 rounded-xl border object-cover"
                  />

                  <div>
                    <div className="font-medium">
                      {image.alt_text ?? "Sin texto alternativo"}
                    </div>

                    <div className="mt-1 max-w-xs truncate text-sm text-gray-500">
                      {image.path}
                    </div>
                  </div>
                </div>
              </td>

              <td className="p-4">
                {image.sort_order}
              </td>

              <td className="p-4">
                {image.is_primary ? (
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                    Principal
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Secundaria
                  </span>
                )}
              </td>

              <td className="p-4">
                <div className="flex flex-col gap-3">
                  {!image.is_primary && (
                    <form
                      action={setPrimaryProductImage.bind(
                        null,
                        productId,
                        image.id
                      )}
                    >
                      <button
                        type="submit"
                        className="text-sm font-medium text-pink-600 hover:text-pink-700"
                      >
                        Hacer principal
                      </button>
                    </form>
                  )}

                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Editar
                    </summary>

                    <div className="mt-4 min-w-[20rem] rounded-xl border bg-gray-50 p-4">
                      <ImageForm
                        mode="edit"
                        image={image}
                        submitLabel="Guardar imagen"
                        action={updateProductImage.bind(
                          null,
                          productId,
                          image.id
                        )}
                      />
                    </div>
                  </details>

                  <form
                    action={deleteProductImage.bind(
                      null,
                      productId,
                      image.id
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
