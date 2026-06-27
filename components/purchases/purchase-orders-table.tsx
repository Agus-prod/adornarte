import Link from "next/link";

import type { PurchaseOrder } from "@/lib/purchases/get-purchase-orders";

import { formatCurrency } from "@/lib/utils/format";

type Props = {
  orders: PurchaseOrder[];
};

export function PurchaseOrdersTable({
  orders,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left text-sm text-gray-600">

            <th className="px-6 py-4">
              Número
            </th>

            <th className="px-6 py-4">
              Proveedor
            </th>

            <th className="px-6 py-4">
              Fecha
            </th>

            <th className="px-6 py-4">
              Estado
            </th>

            <th className="px-6 py-4">
              Total
            </th>

            <th className="px-6 py-4 text-right">
              Acción
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order.id}
              className="border-t"
            >

              <td className="px-6 py-4 font-medium">
                {order.number}
              </td>

              <td className="px-6 py-4">
                {order.supplier.name}
              </td>

              <td className="px-6 py-4">
                {order.order_date}
              </td>

              <td className="px-6 py-4">

                <span
                  className={
                    order.status === "received"
                      ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"

                      : order.status === "pending"
                      ? "rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"

                      : "rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700"
                  }
                >
                  {order.status === "draft"
                    ? "En edición"
                    : order.status === "sent"
                    ? "Pendiente"
                    : "Recibida"}

                </span>

              </td>

              <td className="px-6 py-4">
                {formatCurrency(order.total)}
              </td>

              <td className="px-6 py-4 text-right">

                <Link
                  href={`/compras/ordenes/${order.id}`}
                  className="rounded-lg border px-3 py-2 hover:bg-gray-100"
                >
                  Ver
                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}