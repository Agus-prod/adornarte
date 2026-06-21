import { createProduct } from "../actions";
import { getCategories } from "@/lib/categories/get-categories";
import { getBrands } from "@/lib/brands/get-brands";

export default async function NuevoProductoPage() {
  const categories =
    await getCategories();

  const brands =
    await getBrands();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 <h2
  className="
    mt-4
    text-3xl
    font-bold
    tracking-tight
  "
> font-bold">
        Nuevo Producto
      </h1>

      <form
        action={createProduct}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block">
            Nombre
          </label>

          <input
            name="name"
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
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Descripción
          </label>

          <textarea
            name="description"
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
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Seleccionar
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
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Seleccionar
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
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block">
              Stock Inicial
            </label>

            <input
              type="number"
              name="stock"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Stock Mínimo
            </label>

            <input
              type="number"
              name="min_stock"
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
}