import { ImageForm } from "@/components/products/forms/image-form";
import { ProductImagesTable } from "@/components/products/tables/product-images-table";
import { EmptyState } from "@/components/ui/empty-state";
import { uploadProductImage } from "@/app/(dashboard)/inventario/productos/image-actions";
import { getProductImagesForEditor } from "@/lib/catalog/services/image-service";

type Props = {
  productId: string;
};

export async function ProductImagesCard({
  productId,
}: Props) {
  const images =
    await getProductImagesForEditor(
      productId
    );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Imágenes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Administra galería, orden e imagen principal del producto.
          </p>
        </div>

        <details className="w-full md:w-auto">
          <summary className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-center font-medium text-white hover:bg-pink-700">
            Subir imagen
          </summary>

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 md:min-w-[36rem]">
            <ImageForm
              mode="create"
              submitLabel="Subir imagen"
              action={uploadProductImage.bind(
                null,
                productId
              )}
            />
          </div>
        </details>
      </div>

      <div className="mt-6">
        {images.length === 0 ? (
          <EmptyState
            title="Este producto no tiene imágenes"
            description="Sube la primera imagen para iniciar la galería del producto."
          />
        ) : (
          <ProductImagesTable
            productId={productId}
            images={images}
          />
        )}
      </div>
    </div>
  );
}
