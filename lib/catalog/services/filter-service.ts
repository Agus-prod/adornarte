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
  CatalogFilterOptions,
  CatalogProductFilters,
  CatalogProductSummary,
} from "@/lib/catalog/types";

function normalize(value: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getAttributeValue(
  attributes: Awaited<
    ReturnType<typeof getAttributes>
  >,
  type: string
) {
  return (
    attributes.find(
      (attribute) =>
        normalize(attribute.type) ===
        normalize(type)
    )?.value ?? null
  );
}

function getDistinctValues(
  values: Array<string | null>
) {
  return Array.from(
    new Set(
      values.filter(
        (value): value is string =>
          Boolean(value)
      )
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function getCatalogFilterOptions(
  organizationId: string
): Promise<CatalogFilterOptions> {
  const [
    brands,
    categories,
    publications,
  ] = await Promise.all([
    getActiveCatalogBrands(
      organizationId
    ),
    getActiveCatalogCategories(
      organizationId
    ),
    getPublishedPublications(
      organizationId
    ),
  ]);

  const attributeGroups =
    await Promise.all(
      publications.map(
        async (publication) =>
          getAttributes(
            publication.product_id,
            organizationId
          )
      )
    );
  const attributes =
    attributeGroups.flat();

  return {
    brands,
    categories,
    colors: getDistinctValues(
      attributes
        .filter(
          (attribute) =>
            attribute.type === "color"
        )
        .map(
          (attribute) =>
            attribute.value
        )
    ),
    tones: getDistinctValues(
      attributes
        .filter(
          (attribute) =>
            attribute.type === "tone"
        )
        .map(
          (attribute) =>
            attribute.value
        )
    ),
    finishes: getDistinctValues(
      attributes
        .filter(
          (attribute) =>
            attribute.type === "finish"
        )
        .map(
          (attribute) =>
            attribute.value
        )
    ),
  };
}

export async function getFilteredCatalogProducts(
  organizationId: string,
  filters: CatalogProductFilters
): Promise<CatalogProductSummary[]> {
  const publications =
    await getPublishedPublications(
      organizationId
    );

  const products: Array<
    CatalogProductSummary | null
  > =
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
        const salePrice =
          product.offer_price ??
          product.sale_price ??
          0;
        const color =
          getAttributeValue(
            attributes,
            "color"
          );
        const tone =
          getAttributeValue(
            attributes,
            "tone"
          );
        const finish =
          getAttributeValue(
            attributes,
            "finish"
          );

        if (
          filters.brandId &&
          product.brand_id !== filters.brandId
        ) {
          return null;
        }

        if (
          filters.categoryId &&
          product.category_id !==
            filters.categoryId
        ) {
          return null;
        }

        if (
          filters.minPrice !== undefined &&
          salePrice < filters.minPrice
        ) {
          return null;
        }

        if (
          filters.maxPrice !== undefined &&
          salePrice > filters.maxPrice
        ) {
          return null;
        }

        if (
          filters.color &&
          normalize(color) !==
            normalize(filters.color)
        ) {
          return null;
        }

        if (
          filters.tone &&
          normalize(tone) !==
            normalize(filters.tone)
        ) {
          return null;
        }

        if (
          filters.finish &&
          normalize(finish) !==
            normalize(filters.finish)
        ) {
          return null;
        }

        if (
          filters.inStock &&
          (product.stock ?? 0) <= 0
        ) {
          return null;
        }

        if (
          filters.onOffer &&
          product.offer_price === null
        ) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          slug: publication.slug,
          description:
            product.description,
          imageUrl:
            publication.open_graph_image_url ??
            product.image_url,
          salePrice,
          isFeatured:
            publication.is_featured,
        };
      })
    );

  return products.filter(
    (product): product is CatalogProductSummary =>
      product !== null
  );
}
