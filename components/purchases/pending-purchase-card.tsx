import Link from "next/link";

import { ReceivePurchaseOrderButton } from "./receive-purchase-order-button";

type Props = {
  order: {
    id: string;
    number: string;
    order_date: string;
    total: number;
    supplier: {
      name: string;
    };
  };
};

export function PendingPurchaseCard({
  order,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            {order.number}
          </h2>

          <p className="mt-1 text-gray-500">
            {order.supplier.name}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            {order.order_date}
          </p>

        </div>

        <div className="text-right">

          <div className="text-2xl font-bold">
            L {order.total.toFixed(2)}
          </div>

          <p className="text-sm text-gray-500">
            Total
          </p>

        </div>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <Link
          href={`/compras/ordenes/${order.id}`}
          className="rounded-xl border px-5 py-2 hover:bg-gray-50"
        >
          Ver detalle
        </Link>

        <ReceivePurchaseOrderButton
  purchaseOrderId={order.id}
/>

      </div>

    </div>
  );
}