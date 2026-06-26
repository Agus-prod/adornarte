import { PageHeader } from "@/components/ui/page-header";

import { PurchaseOrderFormContainer } from "@/components/purchases/purchase-order-form-container";

import { createPurchaseOrderAction } from "../actions";

import { getActiveSuppliers } from "@/lib/purchases/get-active-suppliers";

export default async function NewPurchaseOrderPage() {
  const suppliers = await getActiveSuppliers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva orden"
        description="Crear orden de compra."
      />

      <PurchaseOrderFormContainer
        suppliers={suppliers}
        action={createPurchaseOrderAction}
      />
    </div>
  );
}