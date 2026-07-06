import { registerPayment } from "@/app/catalogo/checkout/pago/actions";
import { PaymentMethodFields } from "@/components/catalog/payment-method-fields";
import type {
  CatalogBankAccount,
  CatalogCartDetail,
  CatalogPaymentMethod,
  CatalogPayment,
} from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
  payments: CatalogPayment[];
  bankAccounts: CatalogBankAccount[];
};

export function PaymentForm({
  cart,
  payments,
  bankAccounts,
}: Props) {
  const paymentMethod =
    (cart.cart.payment_method ??
      "cash_on_delivery") as CatalogPaymentMethod;

  return (
    <form
      action={registerPayment}
      encType="multipart/form-data"
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Metodo de pago
        </h2>

        <PaymentMethodFields
          defaultMethod={paymentMethod}
          bankAccounts={bankAccounts}
        />

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
