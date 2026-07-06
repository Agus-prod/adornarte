import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type Props = {
  products: CatalogProductSummary[];
};

export function CatalogProductGrid({
  products,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
        No hay productos publicados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <CatalogProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
