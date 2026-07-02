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
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
        No hay productos publicados.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <CatalogProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
