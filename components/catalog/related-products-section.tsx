import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type Props = {
  products: CatalogProductSummary[];
};

export function RelatedProductsSection({
  products,
}: Props) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Más de la misma categoría
      </h2>

      <CatalogProductGrid
        products={products}
      />
    </section>
  );
}
