import type { Metadata } from "next";
import type {
  CatalogProductDetail,
  CatalogProductSeo,
} from "@/lib/catalog/types";

type SeoMetadataInput = {
  title: string;
  description: string | null;
  canonicalUrl?: string | null;
  imageUrl?: string | null;
  seo?: CatalogProductSeo;
};

function getTitle(input: SeoMetadataInput) {
  return (
    input.seo?.metaTitle ??
    input.seo?.openGraphTitle ??
    input.title
  );
}

function getDescription(
  input: SeoMetadataInput
) {
  return (
    input.seo?.metaDescription ??
    input.seo?.openGraphDescription ??
    input.description ??
    undefined
  );
}

function getImageUrl(
  input: SeoMetadataInput
) {
  return (
    input.seo?.openGraphImageUrl ??
    input.imageUrl ??
    undefined
  );
}

export function buildCatalogMetadata(
  input: SeoMetadataInput
): Metadata {
  const title = getTitle(input);
  const description =
    getDescription(input);
  const imageUrl = getImageUrl(input);
  const canonicalUrl =
    input.seo?.canonicalUrl ??
    input.canonicalUrl ??
    undefined;

  return {
    title,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl
        ? "summary_large_image"
        : "summary",
      title,
      description,
      images: imageUrl
        ? [imageUrl]
        : undefined,
    },
  };
}

export function buildProductSchema(
  product: CatalogProductDetail
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl
      ? [product.imageUrl]
      : undefined,
    sku: product.product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "HNL",
      price: product.salePrice ?? 0,
      availability:
        (product.product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}
