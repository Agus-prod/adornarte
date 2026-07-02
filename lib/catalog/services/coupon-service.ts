import {
  getCouponByCode,
  type CatalogCoupon,
} from "@/lib/catalog/repositories/coupon-repository";

export function normalizeCouponCode(
  code: string
) {
  return code.trim().toUpperCase();
}

export function validateCoupon(
  coupon: CatalogCoupon | null,
  subtotal: number
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
  subtotal: number
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

  return validateCoupon(
    coupon,
    subtotal
  );
}
