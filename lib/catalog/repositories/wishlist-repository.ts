import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
} from "@/lib/database.types";

export type CatalogWishlistItem =
  Tables<"catalog_wishlist_items">;

export async function getWishlistItems(
  organizationId: string,
  customerEmail: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_wishlist_items")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("customer_email", customerEmail)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogWishlistItem[];
}

export async function createWishlistItem(
  values: TablesInsert<"catalog_wishlist_items">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_wishlist_items")
    .upsert(values, {
      onConflict:
        "organization_id,customer_email,product_id",
    })
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogWishlistItem;
}

export async function deleteWishlistItem(
  organizationId: string,
  customerEmail: string,
  productId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("catalog_wishlist_items")
    .delete()
    .eq("organization_id", organizationId)
    .eq("customer_email", customerEmail)
    .eq("product_id", productId);

  if (error) throw error;
}
