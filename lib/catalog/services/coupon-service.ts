import {
  getCouponByCode,
  updateCoupon,
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
  if (
    getCouponValidationFailure(
      coupon,
      subtotal,
      customerId
    )
  ) {
    return null;
  }

  return coupon;
}

function getCouponValidationFailure(
  coupon: CatalogCoupon | null,
  subtotal: number,
  customerId?: string | null
) {
  if (!coupon) {
    return "Cupon no encontrado.";
  }

  if (!coupon.is_active) {
    return "Cupon inactivo.";
  }

  const now = Date.now();

  if (
    coupon.starts_at &&
    new Date(coupon.starts_at).getTime() > now
  ) {
    return "Cupon aun no disponible.";
  }

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at).getTime() < now
  ) {
    return "Cupon vencido.";
  }

  if (
    coupon.usage_limit !== null &&
    coupon.used_count >= coupon.usage_limit
  ) {
    return "Cupon sin usos disponibles.";
  }

  if (subtotal < coupon.minimum_subtotal) {
    return `Compra minima requerida: L ${Number(coupon.minimum_subtotal).toFixed(2)}.`;
  }

  if (
    coupon.customer_id &&
    customerId !== undefined &&
    coupon.customer_id !== customerId
  ) {
    return "Cupon asignado a otro cliente.";
  }

  return null;
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

export async function getCouponValidationResult(
  organizationId: string,
  code: string,
  subtotal: number,
  customerEmail?: string | null
) {
  const normalizedCode =
    normalizeCouponCode(code);

  if (!normalizedCode) {
    return {
      coupon: null,
      message: "Ingresa un codigo de cupon.",
    };
  }

  const coupon = await getCouponByCode(
    organizationId,
    normalizedCode
  );
  const customerId =
    customerEmail && coupon?.customer_id
      ? await getCustomerIdByEmail(
          organizationId,
          customerEmail
        )
      : coupon?.customer_id
        ? null
        : undefined;
  const message =
    getCouponValidationFailure(
      coupon,
      subtotal,
      customerId
    );

  return {
    coupon: message ? null : coupon,
    message,
  };
}

export async function registerCouponUse(
  organizationId: string,
  code: string | null
) {
  if (!code) {
    return;
  }

  const coupon = await getCouponByCode(
    organizationId,
    normalizeCouponCode(code)
  );

  if (!coupon) {
    return;
  }

  await updateCoupon(
    coupon.id,
    organizationId,
    {
      used_count: coupon.used_count + 1,
      updated_at: new Date().toISOString(),
    }
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
