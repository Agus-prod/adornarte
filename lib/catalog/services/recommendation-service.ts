import { cookies } from "next/headers";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  getPublishedPublications,
} from "@/lib/catalog/repositories/publication-repository";
import {
  getCatalogProductSummaries,
  getRelatedCatalogProducts,
} from "@/lib/catalog/services/catalog-service";
import type {
  CatalogProductSummary,
  CatalogRecommendations,
} from "@/lib/catalog/types";

const lastViewedCookie =
  "adornarte_catalog_last_viewed";

function uniqueProducts(
  products: CatalogProductSummary[]
) {
  const seen = new Set<string>();

  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false;
    }

    seen.add(product.id);
    return true;
  });
}

async function getLastViewedIds() {
  const cookieStore = await cookies();
  const value =
    cookieStore.get(lastViewedCookie)
      ?.value ?? "";

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function rememberViewedProduct(
  productId: string
) {
  const cookieStore = await cookies();
  const current =
    await getLastViewedIds();
  const next = [
    productId,
    ...current.filter(
      (id) => id !== productId
    ),
  ].slice(0, 8);

  cookieStore.set(
    lastViewedCookie,
    next.join(","),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    }
  );
}

export async function getCatalogRecommendations(
  organizationId: string,
  productId: string
): Promise<CatalogRecommendations> {
  const [
    related,
    allProducts,
    publications,
    lastViewedIds,
  ] = await Promise.all([
    getRelatedCatalogProducts(
      organizationId,
      productId,
      8
    ),
    getCatalogProductSummaries(
      organizationId
    ),
    getPublishedPublications(
      organizationId
    ),
    getLastViewedIds(),
  ]);
  const currentProduct =
    await getCatalogProductById(
      productId,
      organizationId
    );
  const crossSelling = allProducts
    .filter(
      (product) =>
        product.id !== productId &&
        !related.some(
          (item) => item.id === product.id
        )
    )
    .slice(0, 4);
  const upselling = (
    await Promise.all(
      publications.map(
        async (publication) => {
          if (
            publication.product_id ===
            productId
          ) {
            return null;
          }

          const product =
            await getCatalogProductById(
              publication.product_id,
              organizationId
            );

          if (
            (product.sale_price ?? 0) <=
            (currentProduct.sale_price ?? 0)
          ) {
            return null;
          }

          return allProducts.find(
            (summary) =>
              summary.id === product.id
          ) ?? null;
        }
      )
    )
  )
    .filter(
      (
        product
      ): product is CatalogProductSummary =>
        product !== null
    )
    .slice(0, 4);
  const lastViewed = allProducts.filter(
    (product) =>
      product.id !== productId &&
      lastViewedIds.includes(product.id)
  );

  return {
    related: uniqueProducts(related),
    crossSelling:
      uniqueProducts(crossSelling),
    upselling: uniqueProducts(upselling),
    lastViewed: uniqueProducts(
      lastViewed
    ),
  };
}
