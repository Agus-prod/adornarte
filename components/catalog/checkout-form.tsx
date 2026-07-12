import { saveCheckout } from "@/app/catalogo/checkout/actions";
import { PaymentMethodFields } from "@/components/catalog/payment-method-fields";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";
import type { CatalogShippingZone } from "@/lib/catalog/repositories/shipping-repository";
import type {
  CatalogBankAccount,
  CatalogCartDetail,
  CatalogPaymentMethod,
} from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
  customer: CatalogCustomer | null;
  bankAccounts: CatalogBankAccount[];
  shippingZones: CatalogShippingZone[];
};

export function CheckoutForm({
  cart,
  customer,
  bankAccounts,
  shippingZones,
}: Props) {
  const customerName =
    customer?.name ??
    cart.cart.customer_name ??
    "";
  const customerEmail =
    customer?.email ??
    cart.cart.customer_email ??
    "";
  const customerPhone =
    customer?.phone ??
    cart.cart.customer_phone ??
    "";
  const hasCustomerPhone =
    customerPhone.trim() !== "";
  const paymentMethod =
    (cart.cart.payment_method ??
      "cash_on_delivery") as CatalogPaymentMethod;
  const defaultShippingZone =
    shippingZones[0] ?? null;

  return (
    <form
      action={saveCheckout}
      className="grid gap-6 lg:grid-cols-[1fr_23rem] lg:items-start"
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-100/50 sm:rounded-3xl">
          <div className="border-b border-pink-50 bg-pink-50/50 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-pink-600">
              Paso 1
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Datos cliente
            </h2>
          </div>

          {customer ? (
            <div className="space-y-3 p-4 sm:p-5">
              <input
                type="hidden"
                name="customer_name"
                value={customerName}
              />
              <input
                type="hidden"
                name="customer_email"
                value={customerEmail}
              />
              {hasCustomerPhone ? (
                <input
                  type="hidden"
                  name="customer_phone"
                  value={customerPhone}
                />
              ) : (
                <input
                  name="customer_phone"
                  type="tel"
                  required
                  placeholder="Telefono"
                  className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              )}

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-sm font-semibold text-zinc-950">
                  {customerName}
                </p>
                <p className="mt-1 break-words text-sm text-zinc-500">
                  {customerEmail}
                </p>
                {customerPhone ? (
                  <p className="mt-1 text-sm text-zinc-500">
                    {customerPhone}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-500">
                    Agrega tu telefono para coordinar la entrega.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
              <input
                name="customer_name"
                required
                defaultValue={
                  cart.cart.customer_name ?? ""
                }
                placeholder="Nombre"
                className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
              <input
                name="customer_email"
                type="email"
                required
                defaultValue={
                  cart.cart.customer_email ?? ""
                }
                placeholder="Email"
                className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
              <input
                name="customer_phone"
                required
                defaultValue={
                  cart.cart.customer_phone ?? ""
                }
                placeholder="Telefono"
                className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100 md:col-span-2"
              />
              <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 md:col-span-2">
                <input
                  type="hidden"
                  name="create_account"
                  value="on"
                />
                <div className="flex items-start gap-3 text-sm font-semibold text-zinc-900">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="mt-1"
                  />
                  <span>
                    Crear mi cuenta para ver mi pedido después
                    <span className="mt-1 block font-normal text-zinc-500">
                      Usa una contraseña que recuerdes. Con esta cuenta podrás ver pedidos, direcciones e historial.
                    </span>
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Crear contraseña"
                    className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                  <input
                    name="confirm_password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Confirmar contraseña"
                    className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-100/50 sm:rounded-3xl">
          <div className="border-b border-pink-50 bg-pink-50/50 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-pink-600">
              Paso 2
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Direccion y envio
            </h2>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-pink-200 bg-pink-50/70 p-4 text-sm">
                <input
                  type="radio"
                  name="delivery_method"
                  value="home_delivery"
                  defaultChecked
                  className="mr-2"
                />
                <span className="font-semibold">
                  Envio a casa
                </span>
                <span className="mt-1 block text-zinc-500">
                  Entrega nacional
                  {defaultShippingZone
                    ? ` desde L ${Number(defaultShippingZone.base_rate).toFixed(2)}.`
                    : " con costo segun zona disponible."}
                </span>
              </label>
              <label className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
                <input
                  type="radio"
                  name="delivery_method"
                  value="pickup"
                  className="mr-2"
                />
                <span className="font-semibold">
                  Recoger en punto publico
                </span>
                <span className="mt-1 block text-zinc-500">
                  Sin costo de envio. Coordinamos el punto de entrega.
                </span>
              </label>
            </div>
            <input
              name="shipping_address"
              defaultValue={
                cart.cart.shipping_address ?? ""
              }
              placeholder="Direccion o referencia de entrega"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
            {shippingZones.length > 0 ? (
              <select
                name="shipping_city"
                defaultValue={
                  cart.cart.shipping_city ??
                  defaultShippingZone?.city ??
                  defaultShippingZone?.name ??
                  ""
                }
                className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              >
                {shippingZones.map((zone) => (
                  <option
                    key={zone.id}
                    value={
                      zone.city ?? zone.name
                    }
                  >
                    {zone.name}
                    {zone.city
                      ? ` - ${zone.city}`
                      : ""}{" "}
                    · L{" "}
                    {Number(
                      zone.base_rate
                    ).toFixed(2)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="shipping_city"
                defaultValue={
                  cart.cart.shipping_city ?? ""
                }
                placeholder="Ciudad o zona"
                className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
            )}
            <textarea
              name="shipping_notes"
              rows={3}
              defaultValue={
                cart.cart.shipping_notes ?? ""
              }
              placeholder="Notas de entrega"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-100/50 sm:rounded-3xl">
          <div className="border-b border-pink-50 bg-pink-50/50 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-pink-600">
              Paso 3
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Pago
            </h2>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <PaymentMethodFields
              defaultMethod={paymentMethod}
              bankAccounts={bankAccounts}
            />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-pink-100 bg-white p-4 shadow-xl shadow-pink-100/50 sm:rounded-3xl sm:p-5 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase text-pink-600">
          Tu pedido
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight">
          Resumen
        </h2>

        <div className="scrollbar-hidden mt-5 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm text-zinc-600">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3"
            >
              <span>
                {item.quantity} x {item.name}
              </span>
              <span className="font-semibold text-zinc-900">
                L{" "}
                {(
                  item.quantity *
                  Number(item.unit_price)
                ).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <dl className="mt-5 space-y-2 border-t border-pink-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>
              L {cart.totals.subtotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between text-zinc-500">
            <dt>Envio</dt>
            <dd>
              L {cart.totals.shippingTotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between text-zinc-500">
            <dt>Descuento</dt>
            <dd>
              - L {cart.totals.discountTotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-pink-100 pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd>
              L {cart.totals.total.toFixed(2)}
            </dd>
          </div>
        </dl>

        <button
          type="submit"
          className="mt-5 min-h-12 w-full rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white shadow-lg shadow-pink-200/70 transition hover:bg-pink-700"
        >
          Continuar con mi pedido
        </button>
      </aside>
    </form>
  );
}
