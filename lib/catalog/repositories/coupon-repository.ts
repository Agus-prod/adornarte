import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogCoupon =
  Tables<"catalog_coupons">;

export async function getCouponByCode(
  organizationId: string,
  code: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_coupons")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogCoupon | null;
}

export async function updateCoupon(
  couponId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_coupons">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_coupons")
    .update(values)
    .eq("id", couponId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCoupon;
}
