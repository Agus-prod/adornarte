import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/database.types";

export type CatalogMarketplaceFeed =
  Tables<"catalog_marketplace_feeds">;

export async function getActiveMarketplaceFeeds(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_marketplace_feeds")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("channel");

  if (error) throw error;

  return data satisfies CatalogMarketplaceFeed[];
}
