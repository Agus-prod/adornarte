import { registerPayment } from "@/app/catalogo/checkout/pago/actions";
import type {
  CatalogCartDetail,
  CatalogPayment,
} from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
  payments: CatalogPayment[];
};

export function PaymentForm({
  cart,
  payments,
}: Props) {
  return (
    <form
      action={registerPayment}
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Metodo de pago
        </h2>

        <select
          name="method"
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

        <input
          name="reference"
          placeholder="Referencia"
          className="min-h-11 w-full rounded-lg border px-3 text-sm"
        />

        <textarea
          name="notes"
          rows={3}
          placeholder="Notas de pago"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </section>

      <aside className="h-fit rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Pago
        </h2>
        <div className="mt-4 text-2xl font-bold text-pink-600">
          L {cart.totals.total.toFixed(2)}
        </div>

        {payments.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-lg border p-3"
              >
                {payment.method} - {payment.status}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="mt-5 min-h-11 w-full rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Confirmar pago
        </button>
      </aside>
    </form>
  );
}
