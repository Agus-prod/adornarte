import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getOrder } from "@/lib/catalog/repositories/order-repository";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CatalogOrderPage({
  params,
}: PageProps) {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          Catalogo no configurado
        </h1>
      </main>
    );
  }

  const { id } = await params;
  const order = await getOrder(
    id,
    organizationId
  );

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Pedido {order.order_number}
      </h1>
      <div className="rounded-lg border bg-white p-5">
        <div className="text-sm text-gray-500">
          Estado
        </div>
        <div className="mt-1 text-xl font-semibold">
          {order.status}
        </div>
        <div className="mt-4 text-2xl font-bold text-pink-600">
          L {Number(order.total).toFixed(2)}
        </div>
      </div>
    </main>
  );
}
