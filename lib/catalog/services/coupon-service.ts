import {
  getCouponByCode,
  type CatalogCoupon,
} from "@/lib/catalog/repositories/coupon-repository";
import { createAdminClient } from "@/lib/supabase/admin";

export function normalizeCouponCode(
  code: string
) {
  return code.trim().toUpperCase();
}

export function validateCoupon(
  coupon: CatalogCoupon | null,
  subtotal: number,
  customerId?: string | null
) {
  if (!coupon || !coupon.is_active) {
    return null;
  }

  const now = Date.now();

  if (
    coupon.starts_at &&
    new Date(coupon.starts_at).getTime() > now
  ) {
    return null;
  }

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at).getTime() < now
  ) {
    return null;
  }

  if (
    coupon.usage_limit !== null &&
    coupon.used_count >= coupon.usage_limit
  ) {
    return null;
  }

  if (subtotal < coupon.minimum_subtotal) {
    return null;
  }

  if (
    coupon.customer_id &&
    customerId !== undefined &&
    coupon.customer_id !== customerId
  ) {
    return null;
  }

  return coupon;
}

export function getCouponDiscount(
  coupon: CatalogCoupon | null,
  subtotal: number,
  shippingTotal: number
) {
  const validCoupon = validateCoupon(
    coupon,
    subtotal
  );

  if (!validCoupon) {
    return 0;
  }

  if (validCoupon.type === "percent") {
    return Math.min(
      subtotal,
      subtotal *
        (validCoupon.value / 100)
    );
  }

  if (validCoupon.type === "amount") {
    return Math.min(
      subtotal,
      validCoupon.value
    );
  }

  if (
    validCoupon.type === "free_shipping"
  ) {
    return shippingTotal;
  }

  return 0;
}

export async function getValidCouponByCode(
  organizationId: string,
  code: string,
  subtotal: number,
  customerEmail?: string | null
) {
  const normalizedCode =
    normalizeCouponCode(code);

  if (!normalizedCode) {
    return null;
  }

  const coupon =
    await getCouponByCode(
      organizationId,
      normalizedCode
    );
  const customerId =
    customerEmail && coupon?.customer_id
      ? await getCustomerIdByEmail(
          organizationId,
          customerEmail
        )
      : null;

  return validateCoupon(
    coupon,
    subtotal,
    customerId
  );
}

async function getCustomerIdByEmail(
  organizationId: string,
  email: string
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}
