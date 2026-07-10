import { cache } from "react";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  getPublishedPublicationBySlug,
  getPublishedPublications,
} from "@/lib/catalog/repositories/publication-repository";
import { getAttributes } from "@/lib/catalog/repositories/attribute-repository";
import { getImages } from "@/lib/catalog/repositories/image-repository";
import { getVariants } from "@/lib/catalog/repositories/variant-repository";
import type {
  CatalogProductDetail,
  CatalogProductSeo,
  CatalogProductSummary,
} from "@/lib/catalog/types";
import type { ProductPublication } from "@/lib/catalog/repositories/publication-repository";

type CatalogProductRecord = Awaited<
  ReturnType<typeof getCatalogProductById>
>;

function getSeo(
  publication: ProductPublication
): CatalogProductSeo {
  return {
    metaTitle: publication.meta_title,
    metaDescription:
      publication.meta_description,
    canonicalUrl:
      publication.canonical_url,
    openGraphTitle:
      publication.open_graph_title,
    openGraphDescription:
      publication.open_graph_description,
    openGraphImageUrl:
      publication.open_graph_image_url,
  };
}

async function getSummary(
  organizationId: string,
  publication: ProductPublication
): Promise<CatalogProductSummary> {
  const product =
    await getCatalogProductById(
      publication.product_id,
      organizationId
    );

  return getSummaryFromProduct(
    publication,
    product
  );
}

function getSummaryFromProduct(
  publication: ProductPublication,
  product: CatalogProductRecord
): CatalogProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: publication.slug,
    description: product.description,
    categoryId: product.category_id,
    imageUrl:
      publication.open_graph_image_url ??
      product.image_url,
    regularPrice: product.sale_price,
    salePrice:
      product.offer_price ??
      product.sale_price,
    isFeatured: publication.is_featured,
  };
}

export async function getCatalogProductSummaries(
  organizationId: string
) {
  const publications =
    await getPublishedPublications(
      organizationId
    );

  return Promise.all(
    publications.map((publication) =>
      getSummary(
        organizationId,
        publication
      )
    )
  );
}

export const getCatalogProductDetailBySlug = cache(async function getCatalogProductDetailBySlug(
  organizationId: string,
  slug: string
): Promise<CatalogProductDetail | null> {
  const publication =
    await getPublishedPublicationBySlug(
      organizationId,
      slug
    );

  if (!publication) {
    return null;
  }

  const [
    product,
    variants,
    images,
    attributes,
  ] = await Promise.all([
    getCatalogProductById(
      publication.product_id,
      organizationId
    ),
    getVariants(
      publication.product_id,
      organizationId
    ),
    getImages(
      publication.product_id,
      organizationId
    ),
    getAttributes(
      publication.product_id,
      organizationId
    ),
  ]);

  return {
    id: product.id,
    name: product.name,
    slug: publication.slug,
    description: product.description,
    categoryId: product.category_id,
    imageUrl:
      publication.open_graph_image_url ??
      product.image_url,
    regularPrice: product.sale_price,
    salePrice:
      product.offer_price ??
      product.sale_price,
    isFeatured: publication.is_featured,
    product,
    publication,
    variants,
    images,
    attributes,
    seo: getSeo(publication),
  };
});

export async function getRelatedCatalogProducts(
  organizationId: string,
  productId: string,
  limit = 4
) {
  const [
    currentProduct,
    publications,
  ] = await Promise.all([
    getCatalogProductById(
      productId,
      organizationId
    ),
    getPublishedPublications(
      organizationId
    ),
  ]);

  const relatedProducts =
    await Promise.all(
      publications.map(async (publication) => {
        if (
          publication.product_id === productId
        ) {
          return null;
        }

        const product =
          await getCatalogProductById(
            publication.product_id,
            organizationId
          );

        const sameCategory =
          currentProduct.category_id !==
            null &&
          currentProduct.category_id ===
            product.category_id;
        if (!sameCategory) {
          return null;
        }

        return getSummaryFromProduct(
          publication,
          product
        );
      })
    );

  return relatedProducts
    .filter(
      (
        product
      ): product is CatalogProductSummary =>
        product !== null
    )
    .slice(0, limit);
}
