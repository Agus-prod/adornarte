import { PageHeader } from "@/components/ui/page-header";

import { PurchaseOrderDetail } from "@/components/purchases/purchase-order-detail";

import { getPurchaseOrder } from "@/lib/purchases/get-purchase-order";
import { getActiveProducts } from "@/lib/inventory/get-active-products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseOrderPage({
  params,
}: Props) {
  const { id } = await params;

  const [order, products] = await Promise.all([
    getPurchaseOrder(id),
    getActiveProducts(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.number ?? "Orden de compra"}
        description="Detalle de la orden de compra."
      />

      <PurchaseOrderDetail
        order={order}
        products={products}
      />
    </div>
  );
}