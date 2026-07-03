import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Json,
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogSearchDocument =
  Tables<"catalog_search_documents">;

export async function upsertSearchDocument(
  values: TablesInsert<"catalog_search_documents">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_search_documents")
    .upsert(values, {
      onConflict:
        "organization_id,product_id",
    })
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogSearchDocument;
}

export async function getSearchDocuments(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_search_documents")
    .select("*")
    .eq("organization_id", organizationId);

  if (error) throw error;

  return data satisfies CatalogSearchDocument[];
}

export function serializeEmbedding(
  values: number[] | null
): Json | null {
  return values;
}
