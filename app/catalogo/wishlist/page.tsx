import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getWishlistProductSummaries } from "@/lib/catalog/services/wishlist-service";

export default async function WishlistPage() {
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

  const products =
    await getWishlistProductSummaries();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Favoritos
      </h1>

      <CatalogProductGrid
        products={products}
      />
    </main>
  );
}
