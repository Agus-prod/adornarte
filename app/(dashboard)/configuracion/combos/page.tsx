import { createComboPromotionAction } from "@/app/(dashboard)/configuracion/combos/actions";
import {
  getComboItems,
  getComboRegularPrice,
  getPromotionManagementView,
} from "@/lib/catalog/services/promotion-management-service";

function money(value: number) {
  return `L ${value.toFixed(2)}`;
}

export default async function CombosPage() {
  const { promotions, products } =
    await getPromotionManagementView();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Combos
        </h1>
        <p className="mt-2 text-gray-500">
          Crea paquetes con varios productos, precio normal calculado y un precio oferta unico para el catalogo.
        </p>
      </div>

      <form
        action={createComboPromotionAction}
        className="space-y-5 rounded-3xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_14rem_14rem]">
          <input
            name="name"
            required
            placeholder="Nombre del combo"
            className="min-h-11 rounded-2xl border px-3 text-sm"
          />
          <input
            name="offer_price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="Precio oferta"
            className="min-h-11 rounded-2xl border px-3 text-sm"
          />
          <label className="flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
            />
            Activo
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <input
            name="starts_at"
            type="datetime-local"
            className="min-h-11 rounded-2xl border px-3 text-sm"
          />
          <input
            name="expires_at"
            type="datetime-local"
            className="min-h-11 rounded-2xl border px-3 text-sm"
          />
        </div>

        <div className="rounded-3xl border border-pink-100 bg-pink-50/40 p-4">
          <div className="mb-3">
            <h2 className="font-bold">
              Productos del combo
            </h2>
            <p className="text-sm text-gray-500">
              Selecciona dos o mas productos. La venta normal se calcula con el precio individual por cantidad.
            </p>
          </div>

          <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const price =
                product.offer_price ??
                product.sale_price ??
                0;

              return (
                <label
                  key={product.id}
                  className="grid min-h-16 cursor-pointer grid-cols-[auto_1fr_5rem] items-center gap-3 rounded-2xl border bg-white p-3 text-sm transition hover:border-pink-200"
                >
                  <input
                    type="checkbox"
                    name="product_id"
                    value={product.id}
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {money(price)}
                    </span>
                  </span>
                  <input
                    name={`quantity_${product.id}`}
                    type="number"
                    min="1"
                    defaultValue={1}
                    aria-label={`Cantidad de ${product.name}`}
                    className="min-h-10 rounded-xl border px-2 text-center text-sm"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="min-h-11 w-full rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Crear combo
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Combo</th>
              <th className="p-4">Productos</th>
              <th className="p-4">Venta normal</th>
              <th className="p-4">Precio oferta</th>
              <th className="p-4">Ahorro</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => {
              const items =
                getComboItems(promotion);
              const regularPrice =
                getComboRegularPrice(
                  promotion
                );
              const offerPrice = Number(
                promotion.value
              );
              const savings = Math.max(
                0,
                regularPrice - offerPrice
              );

              return (
                <tr
                  key={promotion.id}
                  className="border-t align-top"
                >
                  <td className="p-4 font-bold">
                    {promotion.name}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {items.map((item) => (
                        <div key={item.id}>
                          {item.quantity} x{" "}
                          {item.product?.name ??
                            "Producto"}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-semibold">
                    {money(regularPrice)}
                  </td>
                  <td className="p-4 font-bold text-pink-600">
                    {money(offerPrice)}
                  </td>
                  <td className="p-4">
                    {money(savings)}
                  </td>
                  <td className="p-4">
                    {promotion.is_active
                      ? "Activo"
                      : "Inactivo"}
                  </td>
                </tr>
              );
            })}
            {!promotions.length && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No hay combos creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
