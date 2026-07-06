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
  if (!account) {
    return (
      <section className="rounded-3xl border border-pink-100 bg-white p-8 shadow-xl shadow-pink-100/50">
        <p className="text-sm font-semibold uppercase text-pink-600">
          Acceso requerido
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Inicia sesion para ver tu cuenta
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Tus pedidos, direcciones e historial solo se muestran cuando entras con tu email y contraseña.
        </p>
      </section>
    );
  }

  const pendingOrders =
    account.orders.filter(
      (order) =>
        ![
          "delivered",
          "cancelled",
        ].includes(order.status)
    );
  const pastOrders =
    account.orders.filter((order) =>
      [
        "delivered",
        "cancelled",
      ].includes(order.status)
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/50">
        <div className="flex flex-col gap-4 border-b border-pink-50 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-pink-600">
              Perfil
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Hola, {account.customer.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Estos datos se usan para tus pedidos y notificaciones.
            </p>
          </div>
          <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700">
            Cliente online
          </div>
        </div>
        <form
          action={saveCatalogCustomerProfile}
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <label className="space-y-2">
            <span className="text-sm font-semibold">
              Nombre
            </span>
          <input
            name="name"
            required
            defaultValue={
              account.customer.name
            }
            placeholder="Nombre"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">
              Correo
            </span>
          <input
            name="email"
            type="email"
            required
            defaultValue={
              account.customer.email
            }
            placeholder="Email"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">
              WhatsApp
            </span>
          <input
            name="phone"
            defaultValue={
              account.customer.phone ?? ""
            }
            placeholder="Telefono"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          </label>
          <button
            type="submit"
            className="min-h-12 self-end rounded-2xl bg-pink-600 px-4 text-sm font-bold text-white transition hover:bg-pink-700"
          >
            Guardar cambios
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/50">
        <p className="text-xs font-semibold uppercase text-pink-600">
          Entrega
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Direcciones
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Guarda una direccion frecuente para comprar más rápido.
        </p>
        <form
          action={createCatalogCustomerAddress}
          className="mt-5 space-y-3"
        >
          <input
            name="label"
            placeholder="Etiqueta"
            className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <input
            name="recipient_name"
            required
            placeholder="Recibe"
            className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <input
            name="phone"
            placeholder="Telefono"
            className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <input
            name="address"
            required
            placeholder="Direccion"
            className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <input
            name="city"
            required
            placeholder="Ciudad"
            className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <textarea
            name="notes"
            rows={2}
            placeholder="Notas"
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <input
              type="checkbox"
              name="is_default"
            />
            Principal
          </label>
          <button
            type="submit"
            className="min-h-11 w-full rounded-2xl border border-pink-200 px-4 text-sm font-bold text-pink-700 transition hover:bg-pink-50"
          >
            Agregar direccion
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/50 lg:col-span-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-pink-600">
              Seguimiento
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Pedidos pendientes de entrega
            </h2>
          </div>
          <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-bold text-pink-700">
            {pendingOrders.length} activos
          </span>
        </div>
        {pendingOrders.length ? (
          <div className="mt-5 grid gap-3">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 rounded-3xl border border-zinc-100 bg-zinc-50/60 p-4 text-sm md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <div>
                  <div className="font-semibold">
                    {order.order_number}
                  </div>
                  <div className="mt-1 text-zinc-500">
                    {order.shipping_city} - {order.shipping_address}
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-center font-semibold text-pink-700 shadow-sm">
                  {order.status}
                </span>
                <span className="text-right text-lg font-bold">
                  L {Number(order.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-3xl border border-dashed border-pink-100 bg-pink-50/40 p-5 text-sm text-zinc-500">
            No hay pedidos pendientes de entrega.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/50 lg:col-span-2">
        <p className="text-xs font-semibold uppercase text-pink-600">
          Compras
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Historial
        </h2>
        {pastOrders.length ? (
          <div className="mt-5 grid gap-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-2 rounded-3xl border border-zinc-100 p-4 text-sm sm:grid-cols-[1fr_auto_auto]"
              >
                <span className="font-semibold">{order.order_number}</span>
                <span className="text-zinc-500">{order.status}</span>
                <span className="font-bold">
                  L {Number(order.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-3xl border border-dashed border-pink-100 bg-pink-50/40 p-5 text-sm text-zinc-500">
            Aun no hay pedidos entregados o cancelados.
          </p>
        )}
      </section>
    </div>
  );
}
