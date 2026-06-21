import { getProductById } from "@/lib/products/get-product-by-id";
import { getCategories } from "@/lib/categories/get-categories";
import { getBrands } from "@/lib/brands/get-brands";
import { updateProduct } from "@/app/(dashboard)/inventario/productos/actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product =
    await getProductById(id);

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
      <h1 className="mb-6 text-3xl font-bold">
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
          <select
            name="category_id"
            defaultValue={
              product.category_id ?? ""
            }
            className="rounded-xl border p-3"
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

          <select
            name="brand_id"
            defaultValue={
              product.brand_id ?? ""
            }
            className="rounded-xl border p-3"
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

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="number"
            step="0.01"
            name="cost_price"
            defaultValue={
              product.cost_price ?? 0
            }
            placeholder="Costo"
            className="rounded-xl border p-3"
          />

          <input
            type="number"
            step="0.01"
            name="sale_price"
            defaultValue={
              product.sale_price ?? 0
            }
            placeholder="Venta"
            className="rounded-xl border p-3"
          />

          <input
            type="number"
            step="0.01"
            name="offer_price"
            defaultValue={
              product.offer_price ?? 0
            }
            placeholder="Oferta"
            className="rounded-xl border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="number"
            name="stock"
            defaultValue={
              product.stock ?? 0
            }
            placeholder="Stock"
            className="rounded-xl border p-3"
          />

          <input
            type="number"
            name="min_stock"
            defaultValue={
              product.min_stock ?? 0
            }
            placeholder="Stock mínimo"
            className="rounded-xl border p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}