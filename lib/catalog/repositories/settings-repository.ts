import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogSettings =
  Tables<"catalog_settings">;

export async function getCatalogSettings(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_settings")
    .select("*")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogSettings | null;
}

export async function upsertCatalogSettings(
  values: TablesInsert<"catalog_settings">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_settings")
    .upsert(values, {
      onConflict: "organization_id",
    })
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogSettings;
}

export async function updateCatalogSettings(
  organizationId: string,
  values: TablesUpdate<"catalog_settings">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_settings")
    .update(values)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogSettings;
}
