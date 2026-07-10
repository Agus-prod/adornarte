import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CatalogComboProduct,
  CatalogComboSummary,
  CatalogProductSummary,
} from "@/lib/catalog/types";

type PromotionRow = {
  id: string;
  name: string;
  value: number;
};

type ComboItemRow = {
  promotion_id: string;
  product_id: string;
  quantity: number;
};

type ComboProductRow = {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  image_url: string | null;
  sale_price: number | null;
  offer_price: number | null;
  is_featured: boolean | null;
};

function normalizeProduct(
  product: ComboProductRow
): CatalogProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.id,
    description: product.description,
    categoryId: product.category_id,
    imageUrl: product.image_url,
    regularPrice: product.sale_price,
    salePrice:
      product.offer_price ??
      product.sale_price,
    isFeatured:
      product.is_featured ?? false,
  };
}

function buildComboProducts(
  items: ComboItemRow[],
  products: ComboProductRow[]
): CatalogComboProduct[] {
  return items
    .map((item) => {
      const product = products.find(
        (candidate) =>
          candidate.id === item.product_id
      );

      if (!product) {
        return null;
      }

      return {
        ...normalizeProduct(product),
        quantity: item.quantity,
      };
    })
    .filter(
      (
        product
      ): product is CatalogComboProduct =>
        product !== null
    );
}

export async function getActiveCatalogCombos(
  organizationId: string
): Promise<CatalogComboSummary[]> {
  const supabase = createAdminClient();
  const { data: promotions, error } =
    await supabase
      .from("catalog_promotions")
      .select("id, name, value")
      .eq("organization_id", organizationId)
      .eq("type", "combo")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  const promotionRows =
    (promotions ?? []) as PromotionRow[];
  const promotionIds = promotionRows.map(
    (promotion) => promotion.id
  );

  if (promotionIds.length === 0) {
    return [];
  }

  const { data: items, error: itemsError } =
    await supabase
      .from("catalog_promotion_items")
      .select("promotion_id, product_id, quantity")
      .in("promotion_id", promotionIds);

  if (itemsError) {
    return [];
  }

  const itemRows =
    (items ?? []) as ComboItemRow[];
  const productIds = Array.from(
    new Set(
      itemRows.map((item) => item.product_id)
    )
  );

  if (productIds.length === 0) {
    return [];
  }

  const { data: products, error: productsError } =
    await supabase
      .from("products")
      .select(
        "id, name, description, category_id, image_url, sale_price, offer_price, is_featured"
      )
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .in("id", productIds);

  if (productsError) {
    throw productsError;
  }

  const productRows =
    (products ?? []) as ComboProductRow[];

  return promotionRows
    .map((promotion) => {
      const comboProducts =
        buildComboProducts(
          itemRows.filter(
            (item) =>
              item.promotion_id ===
              promotion.id
          ),
          productRows
        );
      const regularPrice =
        comboProducts.reduce(
          (total, product) =>
            total +
            (product.salePrice ?? 0) *
              product.quantity,
          0
        );
      const offerPrice = Number(
        promotion.value
      );

      return {
        id: promotion.id,
        name: promotion.name,
        description: null,
        regularPrice,
        offerPrice,
        savings: Math.max(
          regularPrice - offerPrice,
          0
        ),
        products: comboProducts,
      };
    })
    .filter(
      (combo) =>
        combo.products.length >= 2 &&
        combo.offerPrice > 0
    );
}
