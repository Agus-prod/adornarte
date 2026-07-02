import { CartSummary } from "@/components/catalog/cart-summary";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";

export default async function CatalogCartPage() {
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

  const cart = await getCartDetail();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Carrito
      </h1>

      <CartSummary cart={cart} />
    </main>
  );
}
