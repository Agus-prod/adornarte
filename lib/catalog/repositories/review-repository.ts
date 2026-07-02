import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogReview =
  Tables<"catalog_reviews">;

export async function getApprovedReviews(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .eq("status", "approved")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogReview[];
}

export async function createReview(
  values: TablesInsert<"catalog_reviews">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_reviews")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogReview;
}

export async function updateReview(
  reviewId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_reviews">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_reviews")
    .update(values)
    .eq("id", reviewId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogReview;
}
