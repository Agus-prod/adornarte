import { getActivePromotions } from "@/lib/catalog/repositories/promotion-repository";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CatalogCartDetail,
  CatalogPromotionDiscount,
} from "@/lib/catalog/types";

type PromotionComboItem = {
  id: string;
  product_id: string;
  quantity: number;
};

function isPromotionActive(
  startsAt: string | null,
  expiresAt: string | null
) {
  const now = Date.now();

  if (
    startsAt &&
    new Date(startsAt).getTime() > now
  ) {
    return false;
  }

  if (
    expiresAt &&
    new Date(expiresAt).getTime() < now
  ) {
    return false;
  }

  return true;
}

export async function getCartPromotionDiscounts(
  cart: CatalogCartDetail
): Promise<CatalogPromotionDiscount[]> {
  const promotions =
    await getActivePromotions(
      cart.cart.organization_id
    );
  const promotionIds = promotions.map(
    (promotion) => promotion.id
  );
  let comboItems: Array<
    PromotionComboItem & {
      promotion_id: string;
    }
  > = [];

  if (promotionIds.length > 0) {
    const supabase = createAdminClient();
    const { data, error } =
      await supabase
        .from("catalog_promotion_items")
        .select(
          "id, promotion_id, product_id, quantity"
        )
        .in(
          "promotion_id",
          promotionIds
        );

    if (!error) {
      comboItems = data ?? [];
    }
  }

  return promotions
    .filter((promotion) =>
      isPromotionActive(
        promotion.starts_at,
        promotion.expires_at
      )
    )
    .map((promotion) => {
      const eligibleItems = cart.items.filter(
        (item) =>
          !promotion.product_id ||
          item.product_id ===
            promotion.product_id
      );
      const eligibleSubtotal =
        eligibleItems.reduce(
          (total, item) =>
            total +
            Number(item.unit_price) *
              item.quantity,
          0
        );
      const eligibleQuantity =
        eligibleItems.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );
      let discount = 0;

      if (promotion.type === "percent") {
        discount =
          eligibleSubtotal *
          (promotion.value / 100);
      }

      if (promotion.type === "amount") {
        discount = Math.min(
          eligibleSubtotal,
          promotion.value
        );
      }

      if (
        promotion.type === "two_for_one" &&
        eligibleQuantity >= 2
      ) {
        const cheapest = Math.min(
          ...eligibleItems.map((item) =>
            Number(item.unit_price)
          )
        );
        discount =
          Math.floor(
            eligibleQuantity / 2
          ) * cheapest;
      }

      if (
        promotion.type === "nxm" &&
        promotion.buy_quantity &&
        promotion.get_quantity &&
        eligibleQuantity >=
          promotion.buy_quantity
      ) {
        const cheapest = Math.min(
          ...eligibleItems.map((item) =>
            Number(item.unit_price)
          )
        );
        discount =
          Math.floor(
            eligibleQuantity /
              promotion.buy_quantity
          ) *
          promotion.get_quantity *
          cheapest;
      }

      if (
        promotion.type === "combo" &&
        comboItems.some(
          (item) =>
            item.promotion_id ===
            promotion.id
        )
      ) {
        const promotionComboItems =
          comboItems.filter(
            (item) =>
              item.promotion_id ===
              promotion.id
          );
        const hasEveryProduct =
          promotionComboItems.every((comboItem) => {
            const cartItem =
              cart.items.find(
                (item) =>
                  item.product_id ===
                  comboItem.product_id
              );

            return (
              cartItem &&
              cartItem.quantity >=
                comboItem.quantity
            );
          });

        if (hasEveryProduct) {
          const regularPrice =
            promotionComboItems.reduce(
              (total, comboItem) => {
                const cartItem =
                  cart.items.find(
                    (item) =>
                      item.product_id ===
                      comboItem.product_id
                  );

                return (
                  total +
                  Number(
                    cartItem?.unit_price ?? 0
                  ) *
                    comboItem.quantity
                );
              },
              0
            );

          discount = Math.max(
            0,
            regularPrice - promotion.value
          );
        }
      } else if (
        promotion.type === "combo" &&
        promotion.minimum_quantity &&
        eligibleQuantity >=
          promotion.minimum_quantity
      ) {
        discount = Math.min(
          eligibleSubtotal,
          promotion.value
        );
      }

      return {
        promotion,
        discount,
      };
    })
    .filter((item) => item.discount > 0);
}
