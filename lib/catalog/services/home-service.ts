import { getActiveCatalogBrands } from "@/lib/catalog/repositories/brand-repository";
import { getFeaturedCollections } from "@/lib/catalog/repositories/collection-repository";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  getPublishedPublications,
} from "@/lib/catalog/repositories/publication-repository";
import { getCatalogProductSummaries } from "@/lib/catalog/services/catalog-service";
import { getActiveCatalogCombos } from "@/lib/catalog/services/combo-service";
import type { CatalogHomeData } from "@/lib/catalog/types";

function isPublicBrand(name: string) {
  return (
    name.trim().toLowerCase() !==
    "generica"
  );
}

export async function getCatalogHomeData(
  organizationId: string
): Promise<CatalogHomeData> {
  const [
    products,
    collections,
    brands,
    publications,
    combos,
  ] = await Promise.all([
    getCatalogProductSummaries(
      organizationId
    ),
    getFeaturedCollections(
      organizationId
    ),
    getActiveCatalogBrands(
      organizationId
    ),
    getPublishedPublications(
      organizationId
    ),
    getActiveCatalogCombos(
      organizationId
    ),
  ]);

  const offerProducts =
    await Promise.all(
      publications.map(async (publication) => {
        const product =
          await getCatalogProductById(
            publication.product_id,
            organizationId
          );

        if (product.offer_price === null) {
          return null;
        }

        return products.find(
          (summary) =>
            summary.id === product.id
        ) ?? null;
      })
    );

  return {
    heroProduct: products[0] ?? null,
    featuredProducts: products
      .filter(
        (product) =>
          product.isFeatured
      )
      .slice(0, 8),
    newProducts: products.slice(0, 8),
    offerProducts: offerProducts
      .filter(
        (
          product
        ): product is NonNullable<
          CatalogHomeData["heroProduct"]
        > => product !== null
      )
      .slice(0, 8),
    collections: collections.slice(0, 6),
    brands: brands
      .filter((brand) =>
        isPublicBrand(brand.name)
      )
      .slice(0, 12),
    combos: combos.slice(0, 8),
  };
}
