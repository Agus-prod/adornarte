import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogNotification =
  Tables<"catalog_notifications">;

export async function createNotification(
  values: TablesInsert<"catalog_notifications">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_notifications")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogNotification;
}
