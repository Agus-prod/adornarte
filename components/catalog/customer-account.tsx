import {
  createCatalogCustomerAddress,
  saveCatalogCustomerProfile,
} from "@/app/catalogo/cuenta/actions";
import type { CatalogCustomerAccount } from "@/lib/catalog/types";

type Props = {
  account: CatalogCustomerAccount | null;
};

export function CustomerAccount({
  account,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Perfil
        </h2>
        <form
          action={saveCatalogCustomerProfile}
          className="grid gap-4 md:grid-cols-2"
        >
          <input
            name="name"
            required
            defaultValue={
              account?.customer.name ?? ""
            }
            placeholder="Nombre"
            className="min-h-11 rounded-lg border px-3 text-sm"
          />
          <input
            name="email"
            type="email"
            required
            defaultValue={
              account?.customer.email ?? ""
            }
            placeholder="Email"
            className="min-h-11 rounded-lg border px-3 text-sm"
          />
          <input
            name="phone"
            defaultValue={
              account?.customer.phone ?? ""
            }
            placeholder="Telefono"
            className="min-h-11 rounded-lg border px-3 text-sm"
          />
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Guardar
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Direcciones
        </h2>
        <form
          action={createCatalogCustomerAddress}
          className="space-y-3"
        >
          <input
            name="label"
            placeholder="Etiqueta"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="recipient_name"
            required
            placeholder="Recibe"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="phone"
            placeholder="Telefono"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="address"
            required
            placeholder="Direccion"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="city"
            required
            placeholder="Ciudad"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <textarea
            name="notes"
            rows={2}
            placeholder="Notas"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_default"
            />
            Principal
          </label>
          <button
            type="submit"
            className="min-h-10 w-full rounded-lg border px-4 text-sm font-semibold hover:bg-gray-50"
          >
            Agregar direccion
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-lg border bg-white p-5 lg:col-span-2">
        <h2 className="text-lg font-semibold">
          Historial
        </h2>
        {account?.orders.length ? (
          <div className="grid gap-3">
            {account.orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between rounded-lg border p-3 text-sm"
              >
                <span>
                  {order.order_number}
                </span>
                <span>{order.status}</span>
                <span>
                  L {Number(order.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hay pedidos registrados.
          </p>
        )}
      </section>
    </div>
  );
}
