import { PageHeader } from "@/components/ui/page-header";

import { getPurchaseOrders } from "@/lib/purchases/get-purchase-orders";

import { PendingPurchaseCard } from "@/components/purchases/pending-purchase-card";

export default async function ReceptionPage() {
  const orders = await getPurchaseOrders();

  const pendingOrders =
    orders.filter(
      (order) => order.status === "sent"
    );

  return (
    <div className="space-y-6">

      <PageHeader
        title="Recepción"
        description="Órdenes pendientes de recibir."
      />

      {pendingOrders.length === 0 ? (

        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          No hay órdenes pendientes de recepción.
        </div>

      ) : (

        <div className="space-y-5">

          {pendingOrders.map((order) => (

            <PendingPurchaseCard
              key={order.id}
              order={order}
            />

          ))}

        </div>

      )}

    </div>
  );
}