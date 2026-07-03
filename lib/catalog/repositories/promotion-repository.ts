import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/database.types";

export type CatalogPromotion =
  Tables<"catalog_promotions">;

export async function getActivePromotions(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_promotions")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("created_at");

  if (error) throw error;

  return data satisfies CatalogPromotion[];
}
