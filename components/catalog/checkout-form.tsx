import { saveCheckout } from "@/app/catalogo/checkout/actions";
import { PaymentMethodFields } from "@/components/catalog/payment-method-fields";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";
import type {
  CatalogBankAccount,
  CatalogCartDetail,
  CatalogPaymentMethod,
} from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
  customer: CatalogCustomer | null;
  bankAccounts: CatalogBankAccount[];
};

export function CheckoutForm({
  cart,
  customer,
  bankAccounts,
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
            <input
              name="shipping_address"
              required
              defaultValue={
                cart.cart.shipping_address ?? ""
              }
              placeholder="Direccion"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
            <input
              name="shipping_city"
              required
              defaultValue={
                cart.cart.shipping_city ?? ""
              }
              placeholder="Ciudad"
              className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
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

        <div className="mt-5 space-y-3 text-sm text-zinc-600">
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

        <div className="mt-5 flex justify-between border-t border-pink-100 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>
            L {cart.totals.total.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          className="mt-5 min-h-12 w-full rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white shadow-lg shadow-pink-200/70 transition hover:bg-pink-700"
        >
          Continuar
        </button>
      </aside>
    </form>
  );
}
