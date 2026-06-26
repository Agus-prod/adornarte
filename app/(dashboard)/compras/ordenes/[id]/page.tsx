import { PageHeader } from "@/components/ui/page-header";

import { PurchaseOrderDetail } from "@/components/purchases/purchase-order-detail";

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

      <PurchaseOrderDetail
        order={order}
      />

    </div>
  );
}