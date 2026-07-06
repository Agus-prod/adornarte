import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogCoupon =
  Tables<"catalog_coupons">;

export async function listCoupons(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_coupons")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogCoupon[];
}

export async function createCoupon(
  values: TablesInsert<"catalog_coupons">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_coupons")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCoupon;
}

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
