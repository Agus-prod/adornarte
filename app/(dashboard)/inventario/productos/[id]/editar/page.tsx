import { getProductById } from "@/lib/products/get-product-by-id";
import { getCategories } from "@/lib/categories/get-categories";
import { getBrands } from "@/lib/brands/get-brands";
import { updateProduct } from "@/app/(dashboard)/inventario/productos/actions";
import { getCompleteProduct } from "@/lib/catalog/services/product-service";
import { ProductVariantsCard } from "@/components/products/variants-card";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

 const product =
  await getProductById(id);

const catalogProduct =
  await getCompleteProduct(id);

const categories =
  await getCategories();

const brands =
  await getBrands();

  async function updateAction(
    formData: FormData
  ) {
    "use server";

    await updateProduct(

      id,
      formData
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Editar Producto
      </h1>

      <form
        action={updateAction}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block">
            Nombre
          </label>

          <input
            name="name"
            defaultValue={product.name}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            SKU
          </label>

          <input
            name="sku"
            defaultValue={product.sku ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Descripción
          </label>

          <textarea
            name="description"
            defaultValue={
              product.description ?? ""
            }
            rows={4}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block">
              Categoría
            </label>

            <select
              name="category_id"
              defaultValue={
                product.category_id ?? ""
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Seleccionar categoría
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block">
              Marca
            </label>

            <select
              name="brand_id"
              defaultValue={
                product.brand_id ?? ""
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Seleccionar marca
              </option>

              {brands.map(
                (brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block">
              Costo
            </label>

            <input
              type="number"
              step="0.01"
              name="cost_price"
              defaultValue={
                product.cost_price ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Precio Venta
            </label>

            <input
              type="number"
              step="0.01"
              name="sale_price"
              defaultValue={
                product.sale_price ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Precio Oferta
            </label>

            <input
              type="number"
              step="0.01"
              name="offer_price"
              defaultValue={
                product.offer_price ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              defaultValue={
                product.stock ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Stock mínimo
            </label>

            <input
              type="number"
              name="min_stock"
              defaultValue={
                product.min_stock ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="rounded-2xl border p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={
                product.is_featured ??
                false
              }
              className="h-5 w-5"
            />

            <span className="font-medium">
              ⭐ Producto destacado
            </span>
          </label>

          <p className="mt-2 text-sm text-gray-500">
            Los productos destacados se
            mostrarán primero en futuras
            promociones y secciones
            especiales.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Guardar Cambios
        </button>
      </form>

<div className="mt-8">

  <ProductVariantsCard
  productId={id}
  variants={catalogProduct.variants}
/>

</div>

</div>
  );
}