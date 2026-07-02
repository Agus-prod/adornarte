import { confirmCatalogOrder } from "@/app/catalogo/checkout/confirmacion/actions";
import type {
  CatalogCartDetail,
  CatalogPayment,
} from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail;
  payments: CatalogPayment[];
};

export function OrderConfirmation({
  cart,
  payments,
}: Props) {
  return (
    <form
      action={confirmCatalogOrder}
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <section className="space-y-4 rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Confirmacion
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>{cart.cart.customer_name}</p>
          <p>{cart.cart.customer_email}</p>
          <p>{cart.cart.shipping_address}</p>
          <p>{cart.cart.shipping_city}</p>
        </div>
      </section>

      <aside className="h-fit rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Pedido
        </h2>
        <div className="mt-4 text-2xl font-bold text-pink-600">
          L {cart.totals.total.toFixed(2)}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Pagos registrados: {payments.length}
        </div>
        <button
          type="submit"
          className="mt-5 min-h-11 w-full rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Crear pedido
        </button>
      </aside>
    </form>
  );
}
