import {
  createCoupon,
  listCoupons,
} from "@/lib/catalog/repositories/coupon-repository";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createAdminClient } from "@/lib/supabase/admin";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function readNumber(
  formData: FormData,
  key: string
) {
  const value = Number(
    readText(formData, key)
  );

  return Number.isFinite(value)
    ? value
    : 0;
}

export async function getCouponManagementView() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase = createAdminClient();
  const [coupons, customersResult] =
    await Promise.all([
      listCoupons(profile.organization_id),
      supabase
        .from("customers")
        .select("id, name, email")
        .eq(
          "organization_id",
          profile.organization_id
        )
        .order("name"),
    ]);

  if (customersResult.error) {
    throw customersResult.error;
  }

  return {
    coupons,
    customers: customersResult.data ?? [],
  };
}

export async function createCouponFromForm(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const code = readText(
    formData,
    "code"
  ).toUpperCase();

  if (!code) {
    throw new Error(
      "Codigo requerido."
    );
  }

  await createCoupon({
    organization_id:
      profile.organization_id,
    name: readText(formData, "name"),
    code,
    type: readText(formData, "type"),
    value: readNumber(
      formData,
      "value"
    ),
    minimum_subtotal: readNumber(
      formData,
      "minimum_subtotal"
    ),
    usage_limit:
      readText(
        formData,
        "usage_limit"
      ) === ""
        ? null
        : readNumber(
            formData,
            "usage_limit"
          ),
    customer_id:
      readText(
        formData,
        "customer_id"
      ) || null,
    expires_at:
      readText(
        formData,
        "expires_at"
      ) || null,
    is_active:
      formData.get("is_active") ===
      "on",
  });
}
