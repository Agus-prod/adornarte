import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogInventorySyncEvent =
  Tables<"catalog_inventory_sync_events">;

export async function createInventorySyncEvent(
  values: TablesInsert<"catalog_inventory_sync_events">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_inventory_sync_events")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogInventorySyncEvent;
}

export async function getLatestInventorySyncEvents(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_inventory_sync_events")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .order("synced_at", {
      ascending: false,
    })
    .limit(20);

  if (error) throw error;

  return data satisfies CatalogInventorySyncEvent[];
}
