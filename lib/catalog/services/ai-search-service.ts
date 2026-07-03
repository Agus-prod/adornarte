import {
  getSearchDocuments,
  serializeEmbedding,
  upsertSearchDocument,
} from "@/lib/catalog/repositories/ai-search-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreDocument(
  query: string,
  text: string
) {
  const normalizedQuery =
    normalize(query);
  const normalizedText =
    normalize(text);

  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .reduce(
      (score, token) =>
        normalizedText.includes(token)
          ? score + 1
          : score,
      0
    );
}

export async function indexCatalogProductForSearch(
  organizationId: string,
  productId: string,
  embedding?: number[]
) {
  const product =
    await getCatalogProductById(
      productId,
      organizationId
    );

  return upsertSearchDocument({
    organization_id: organizationId,
    product_id: product.id,
    search_text: [
      product.name,
      product.sku,
      product.description,
    ]
      .filter(Boolean)
      .join(" "),
    embedding:
      serializeEmbedding(
        embedding ?? null
      ),
    updated_at: new Date().toISOString(),
  });
}

export async function searchCatalogDocuments(
  organizationId: string,
  query: string
) {
  const documents =
    await getSearchDocuments(
      organizationId
    );

  return documents
    .map((document) => ({
      document,
      score: scoreDocument(
        query,
        document.search_text
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
