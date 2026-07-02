import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import type { CatalogRecommendations } from "@/lib/catalog/types";

type Props = {
  recommendations: CatalogRecommendations;
};

function Section({
  title,
  products,
}: {
  title: string;
  products: CatalogRecommendations["related"];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>
      <CatalogProductGrid
        products={products}
      />
    </section>
  );
}

export function RecommendationsSection({
  recommendations,
}: Props) {
  return (
    <div className="space-y-8">
      <Section
        title="Cross selling"
        products={
          recommendations.crossSelling
        }
      />
      <Section
        title="Upselling"
        products={
          recommendations.upselling
        }
      />
      <Section
        title="Ultimos vistos"
        products={
          recommendations.lastViewed
        }
      />
    </div>
  );
}
