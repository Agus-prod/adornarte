import { PageHeader } from "@/components/ui/page-header";

import { getPurchaseOrder } from "@/lib/purchases/get-purchase-order";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseOrderPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await getPurchaseOrder(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.number ?? "Orden de compra"}
        description="Detalle de la orden de compra."
      />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">
              Proveedor
            </p>

            <p className="font-semibold">
              {order.supplier?.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Estado
            </p>

            <p className="font-semibold capitalize">
              {order.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Fecha
            </p>

            <p className="font-semibold">
              {order.order_date}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="font-semibold">
              Q {order.total.toFixed(2)}
            </p>
          </div>

        </div>

        {order.notes && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Observaciones
            </p>

            <p className="mt-1">
              {order.notes}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed p-12 text-center text-gray-500">
        Aún no hay productos en esta orden.
      </div>
    </div>
  );
}