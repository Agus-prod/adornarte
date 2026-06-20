import { createProduct } from "../actions";

export default function NuevoProductoPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">
        Nuevo Producto
      </h1>

      <form
        action={createProduct}
        className="space-y-6"
      >
        <div>
          <label className="block mb-2">
            Nombre
          </label>

          <input
            name="name"
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            SKU
          </label>

          <input
            name="sku"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
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
          <label className="block mb-2">
            Stock Inicial
          </label>

          <input
            type="number"
            name="stock"
            className="w-full rounded-xl border p-3"
          />
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