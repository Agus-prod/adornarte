import Link from "next/link";
import { Plus } from "lucide-react";

import { getPurchaseOrders } from "@/lib/purchases/get-purchase-orders";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PurchaseOrdersTable } from "@/components/purchases/purchase-orders-table";

export default async function PurchaseOrdersPage() {
  const orders = await getPurchaseOrders();

  return (
    <div className="space-y-6">

      <PageHeader
        title="Órdenes de compra"
        description="Administra las órdenes de compra."
        action={
          <Link
            href="/compras/ordenes/nuevo"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-medium text-white hover:bg-pink-600"
          >
            <Plus size={18} />
            Nueva orden
          </Link>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No hay órdenes de compra"
          description="Crea la primera orden."
        />
      ) : (
        <PurchaseOrdersTable
  orders={orders}
/>
      )}

    </div>
  );
}