import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/database.types";

export type CatalogShippingZone =
  Tables<"catalog_shipping_zones">;

export async function getActiveShippingZones(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_shipping_zones")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data satisfies CatalogShippingZone[];
}
