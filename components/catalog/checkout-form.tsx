import { saveCheckout } from "@/app/catalogo/checkout/actions";
import type { CatalogCartDetail } from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
};

export function CheckoutForm({
  cart,
}: Props) {
  return (
    <form
      action={saveCheckout}
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <div className="space-y-6">
        <section className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold">
            Datos cliente
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="customer_name"
              required
              defaultValue={
                cart.cart.customer_name ?? ""
              }
              placeholder="Nombre"
              className="min-h-11 rounded-lg border px-3 text-sm"
            />
            <input
              name="customer_email"
              type="email"
              required
              defaultValue={
                cart.cart.customer_email ?? ""
              }
              placeholder="Email"
              className="min-h-11 rounded-lg border px-3 text-sm"
            />
            <input
              name="customer_phone"
              required
              defaultValue={
                cart.cart.customer_phone ?? ""
              }
              placeholder="Telefono"
              className="min-h-11 rounded-lg border px-3 text-sm"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold">
            Direccion y envio
          </h2>

          <input
            name="shipping_address"
            required
            defaultValue={
              cart.cart.shipping_address ?? ""
            }
            placeholder="Direccion"
            className="min-h-11 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="shipping_city"
            required
            defaultValue={
              cart.cart.shipping_city ?? ""
            }
            placeholder="Ciudad"
            className="min-h-11 w-full rounded-lg border px-3 text-sm"
          />
          <textarea
            name="shipping_notes"
            rows={3}
            defaultValue={
              cart.cart.shipping_notes ?? ""
            }
            placeholder="Notas de entrega"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </section>

        <section className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold">
            Pago
          </h2>

          <select
            name="payment_method"
            required
            defaultValue={
              cart.cart.payment_method ??
              "cash_on_delivery"
            }
            className="min-h-11 w-full rounded-lg border px-3 text-sm"
          >
            <option value="cash_on_delivery">
              Contra entrega
            </option>
            <option value="transfer">
              Transferencia
            </option>
            <option value="stripe">
              Stripe
            </option>
            <option value="paypal">
              PayPal
            </option>
          </select>
        </section>
      </div>

      <aside className="h-fit rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Resumen
        </h2>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3"
            >
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>
                L{" "}
                {(
                  item.quantity *
                  Number(item.unit_price)
                ).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
          <span>Total</span>
          <span>
            L {cart.totals.total.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          className="mt-5 min-h-11 w-full rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Continuar
        </button>
      </aside>
    </form>
  );
}
