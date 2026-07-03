import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogBranchInventory =
  Tables<"catalog_branch_inventory">;

export async function getProductBranchInventory(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_branch_inventory")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .order("available_stock", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogBranchInventory[];
}

export async function upsertBranchInventory(
  values: TablesInsert<"catalog_branch_inventory">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_branch_inventory")
    .upsert(values, {
      onConflict:
        "organization_id,branch_id,product_id,variant_id",
    })
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogBranchInventory;
}
