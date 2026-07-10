import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type { CatalogPromotion } from "@/lib/catalog/repositories/promotion-repository";

export type ProductOption = {
  id: string;
  name: string;
  sale_price: number | null;
  offer_price: number | null;
};

type ComboItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: ProductOption | null;
};

export type ManagedPromotion =
  CatalogPromotion & {
    comboItems: ComboItem[];
  };

function readText(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ""
  ).trim();
}

function readOptionalText(
  formData: FormData,
  key: string
) {
  const value = readText(formData, key);

  return value || null;
}

function readNumber(
  formData: FormData,
  key: string
) {
  const value = Number(
    formData.get(key) ?? 0
  );

  return Number.isFinite(value)
    ? value
    : 0;
}

export function getComboItems(
  promotion: ManagedPromotion
) {
  return (
    promotion.comboItems ?? []
  );
}

export function getComboRegularPrice(
  promotion: ManagedPromotion
) {
  return getComboItems(promotion).reduce(
    (total, item) =>
      total +
      (item.product?.sale_price ?? 0) *
        item.quantity,
    0
  );
}

export async function getPromotionManagementView() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase = createAdminClient();
  const [
    promotionsResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("catalog_promotions")
      .select("*")
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("type", "combo")
      .order("created_at", {
        ascending: false,
      }),
    supabase
      .from("products")
      .select(
        "id, name, sale_price, offer_price"
      )
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("is_active", true)
      .order("name"),
  ]);

  if (promotionsResult.error) {
    throw promotionsResult.error;
  }

  if (productsResult.error) {
    throw productsResult.error;
  }

  const promotions =
    (promotionsResult.data ??
      []) as CatalogPromotion[];
  const products =
    (productsResult.data ??
      []) as ProductOption[];
  const promotionIds = promotions.map(
    (promotion) => promotion.id
  );
  let comboItems: Array<{
    id: string;
    promotion_id: string;
    product_id: string;
    quantity: number;
  }> = [];

  if (promotionIds.length > 0) {
    const itemsResult = await supabase
      .from("catalog_promotion_items")
      .select(
        "id, promotion_id, product_id, quantity"
      )
      .in("promotion_id", promotionIds);

    if (!itemsResult.error) {
      comboItems =
        itemsResult.data ?? [];
    }
  }

  return {
    promotions: promotions.map(
      (promotion) => ({
        ...promotion,
        comboItems: comboItems
          .filter(
            (item) =>
              item.promotion_id ===
              promotion.id
          )
          .map((item) => ({
            id: item.id,
            product_id:
              item.product_id,
            quantity: item.quantity,
            product:
              products.find(
                (product) =>
                  product.id ===
                  item.product_id
              ) ?? null,
          })),
      })
    ),
    products,
  };
}

export async function createComboPromotionFromForm(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const name = readText(
    formData,
    "name"
  );
  const offerPrice = readNumber(
    formData,
    "offer_price"
  );
  const productIds = formData
    .getAll("product_id")
    .map((value) => String(value))
    .filter(Boolean);

  if (
    !name ||
    offerPrice <= 0 ||
    productIds.length < 2
  ) {
    throw new Error(
      "Nombre, precio oferta y al menos dos productos son requeridos."
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("catalog_promotions")
    .insert({
      organization_id:
        profile.organization_id,
      name,
      type: "combo",
      product_id: null,
      minimum_quantity: productIds.length,
      value: offerPrice,
      starts_at: readOptionalText(
        formData,
        "starts_at"
      ),
      expires_at: readOptionalText(
        formData,
        "expires_at"
      ),
      is_active:
        formData.get("is_active") ===
        "on",
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  const items = productIds.map(
    (productId) => {
      const quantity = Math.max(
        1,
        Math.floor(
          readNumber(
            formData,
            `quantity_${productId}`
          )
        )
      );

      return {
        organization_id:
          profile.organization_id,
        promotion_id: data.id,
        product_id: productId,
        quantity,
      };
    }
  );

  const { error: itemsError } =
    await supabase
      .from("catalog_promotion_items")
      .insert(items);

  if (itemsError) {
    throw itemsError;
  }
}
