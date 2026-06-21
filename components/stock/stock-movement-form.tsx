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
      className="space-y-4 rounded-xl border bg-white p-6"
    >
      <div>
        <label className="mb-2 block">
          Producto
        </label>

        <select
          name="product_id"
          required
          className="w-full rounded-xl border p-3"
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
        <label className="mb-2 block">
          Tipo de movimiento
        </label>

        <select
          name="movement_type"
          required
          className="w-full rounded-xl border p-3"
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
        <label className="mb-2 block">
          Cantidad
        </label>

        <input
          type="number"
          min="1"
          name="quantity"
          required
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block">
          Notas
        </label>

        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-pink-500 px-6 py-3 text-white"
      >
        Registrar Movimiento
      </button>
    </form>
  );
}