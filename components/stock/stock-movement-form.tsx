import { createMovement } from "@/app/(dashboard)/inventario/movimientos/actions";

type Product = {
  id: string;
  name: string;
  stock: number | null;
};

export function StockMovementForm({
  products,
}: {
  products: Product[];
}) {
  return (
    <form
      action={createMovement}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Producto
        </label>

        <select
          name="product_id"
          required
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        >
          <option value="">
            Seleccionar producto
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} (Stock: {product.stock ?? 0})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Tipo de movimiento
        </label>

        <select
          name="movement_type"
          required
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        >
          <option value="ENTRADA">
            Entrada
          </option>

          <option value="SALIDA">
            Salida
          </option>

          <option value="AJUSTE">
            Ajuste
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Cantidad
        </label>

        <input
          type="number"
          min="1"
          name="quantity"
          required
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Notas
        </label>

        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-xl border p-3 text-base"
        />
      </div>

      <button
        type="submit"
        className="min-h-12 w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white sm:w-auto"
      >
        Registrar Movimiento
      </button>
    </form>
  );
}
