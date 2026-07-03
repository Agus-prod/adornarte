import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Json,
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogAnalyticsEvent =
  Tables<"catalog_analytics_events">;

export async function createAnalyticsEvent(
  values: TablesInsert<"catalog_analytics_events">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_analytics_events")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogAnalyticsEvent;
}

export async function getAnalyticsEvents(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_analytics_events")
    .select("*")
    .eq("organization_id", organizationId);

  if (error) throw error;

  return data satisfies CatalogAnalyticsEvent[];
}

export function toJsonMetadata(
  value: Record<string, string | number | boolean | null>
): Json {
  return value;
}
