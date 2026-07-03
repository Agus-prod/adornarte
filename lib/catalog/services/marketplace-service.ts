import { getActiveMarketplaceFeeds } from "@/lib/catalog/repositories/marketplace-repository";
import { getCatalogProductSummaries } from "@/lib/catalog/services/catalog-service";
import type {
  CatalogMarketplaceChannel,
  CatalogMarketplaceFeedItem,
} from "@/lib/catalog/types";

function getProductUrl(
  baseUrl: string,
  slug: string
) {
  return `${baseUrl.replace(/\/$/, "")}/catalogo/productos/${slug}`;
}

export async function getMarketplaceFeedItems(
  organizationId: string,
  channel: CatalogMarketplaceChannel,
  baseUrl: string
): Promise<CatalogMarketplaceFeedItem[]> {
  const products =
    await getCatalogProductSummaries(
      organizationId
    );

  return products.map((product) => ({
    channel,
    id: product.id,
    title: product.name,
    description:
      product.description ?? "",
    link: getProductUrl(
      baseUrl,
      product.slug
    ),
    imageLink:
      product.imageUrl ?? "",
    price: product.salePrice ?? 0,
    availability: "in stock",
  }));
}

export async function getMarketplaceFeeds(
  organizationId: string
) {
  return getActiveMarketplaceFeeds(
    organizationId
  );
}
