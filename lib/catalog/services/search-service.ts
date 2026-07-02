import { getAttributes } from "@/lib/catalog/repositories/attribute-repository";
import { getActiveCatalogBrands } from "@/lib/catalog/repositories/brand-repository";
import { getActiveCatalogCategories } from "@/lib/catalog/repositories/category-repository";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  getPublishedPublications,
} from "@/lib/catalog/repositories/publication-repository";
import type {
  CatalogProductSummary,
  CatalogSearchResult,
} from "@/lib/catalog/types";

function normalize(value: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesQuery(
  value: string | null,
  query: string
) {
  return normalize(value).includes(
    query
  );
}

function getUniqueValues(
  values: string[]
) {
  return Array.from(
    new Set(
      values.filter(Boolean)
    )
  );
}

export async function searchCatalogProducts(
  organizationId: string,
  query: string
): Promise<CatalogSearchResult[]> {
  const normalizedQuery =
    normalize(query.trim());

  if (!normalizedQuery) {
    return [];
  }

  const [
    publications,
    brands,
    categories,
  ] = await Promise.all([
    getPublishedPublications(
      organizationId
    ),
    getActiveCatalogBrands(
      organizationId
    ),
    getActiveCatalogCategories(
      organizationId
    ),
  ]);

  const brandNames = new Map(
    brands.map((brand) => [
      brand.id,
      brand.name,
    ])
  );
  const categoryNames = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ])
  );

  const results =
    await Promise.all(
      publications.map(async (publication) => {
        const product =
          await getCatalogProductById(
            publication.product_id,
            organizationId
          );
        const attributes =
          await getAttributes(
            product.id,
            organizationId
          );
        const brandName =
          product.brand_id
            ? brandNames.get(
                product.brand_id
              ) ?? null
            : null;
        const categoryName =
          product.category_id
            ? categoryNames.get(
                product.category_id
              ) ?? null
            : null;
        const matchedFields: string[] = [];

        if (
          includesQuery(
            product.name,
            normalizedQuery
          )
        ) {
          matchedFields.push("name");
        }

        if (
          includesQuery(
            product.sku,
            normalizedQuery
          )
        ) {
          matchedFields.push("sku");
        }

        if (
          includesQuery(
            brandName,
            normalizedQuery
          )
        ) {
          matchedFields.push("brand");
        }

        if (
          includesQuery(
            categoryName,
            normalizedQuery
          )
        ) {
          matchedFields.push("category");
        }

        const hasAttributeMatch =
          attributes.some((attribute) =>
            includesQuery(
              `${attribute.name} ${attribute.value}`,
              normalizedQuery
            )
          );

        if (hasAttributeMatch) {
          matchedFields.push("attributes");
        }

        if (matchedFields.length === 0) {
          return null;
        }

        const summary: CatalogProductSummary =
          {
            id: product.id,
            name: product.name,
            slug: publication.slug,
            description:
              product.description,
            imageUrl:
              publication.open_graph_image_url ??
              product.image_url,
            salePrice:
              product.sale_price,
            isFeatured:
              publication.is_featured,
          };

        return {
          ...summary,
          matchedFields,
        };
      })
    );

  return results.filter(
    (result): result is CatalogSearchResult =>
      result !== null
  );
}

export async function getCatalogAutocompleteSuggestions(
  organizationId: string,
  query: string,
  limit = 8
) {
  const results =
    await searchCatalogProducts(
      organizationId,
      query
    );

  return getUniqueValues(
    results.map((result) => result.name)
  ).slice(0, limit);
}
