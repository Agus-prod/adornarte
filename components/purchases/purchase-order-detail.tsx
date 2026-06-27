import type { ActiveProduct } from "@/lib/inventory/get-active-products";

import { PurchaseOrderItemsCard } from "./purchase-order-items-card";
import { PurchaseOrderItemsTable } from "./purchase-order-items-table";
import { PurchaseOrderActions } from "./purchase-order-actions";

import { formatCurrency } from "@/lib/utils/format";

type Supplier = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string |null;
  email: string | null;
};

type PurchaseOrderItem = {
  id: string;
  quantity: number;
  cost_price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    sku: string | null;
  } | null;
};

type PurchaseOrder = {
  id: string;
  number: string | null;
  status: string;
  order_date: string;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  supplier: Supplier | null;
  items: PurchaseOrderItem[];
};

type Props = {
  order: PurchaseOrder;
  products: ActiveProduct[];
};

export function PurchaseOrderDetail({
  order,
  products,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              {order.number}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orden de compra
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">

            <span
              className={
                order.status === "received"
                  ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                  : order.status === "sent"
                  ? "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                  : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"
              }
            >
              {order.status === "received"
                ? "Recibida"
                : order.status === "sent"
                ? "Pendiente de recepción"
                : "En edición"}
            </span>

            <PurchaseOrderActions
              purchaseOrderId={order.id}
              status={order.status}
            />

          </div>

        </div>

      </div>

      {order.status === "draft" && (
        <PurchaseOrderItemsCard
          purchaseOrderId={order.id}
          products={products}
        />
      )}

      <PurchaseOrderItemsTable
        items={order.items}
        canEdit={order.status === "draft"}
      />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold">
          Totales
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <strong>
              {formatCurrency(order.subtotal)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Impuesto
            </span>

            <strong>
              {formatCurrency(order.tax)}
            </strong>
          </div>

          <div className="flex justify-between border-t pt-4 text-lg">

            <span className="font-semibold">
              Total
            </span>

            <strong>
              {formatCurrency(order.total)}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}