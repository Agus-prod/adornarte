import { createClient } from "@/lib/supabase/server";
import { recalculatePurchaseOrder } from "./recalculate-purchase-order";
import type {
  PurchaseItemFormValues,
} from "./purchase-item-schema";

export async function addPurchaseItem(
  values: PurchaseItemFormValues
) {
  const supabase = await createClient();

  const subtotal =
    values.quantity * values.cost_price;

    const {
  data: existingItem,
  error: existingError,
} = await supabase
  .from("purchase_order_items")
  .select("id")
  .eq(
    "purchase_order_id",
    values.purchase_order_id
  )
  .eq(
    "product_id",
    values.product_id
  )
  .maybeSingle();

if (existingError) {
  throw existingError;
}

if (existingItem) {
  throw new Error(
    "Este producto ya fue agregado a la orden."
  );
}

  const { error } = await supabase
    .from("purchase_order_items")
    .insert({
      purchase_order_id:
        values.purchase_order_id,

      product_id:
        values.product_id,

      quantity:
        values.quantity,

      cost_price:
        values.cost_price,

      subtotal,
    });

  if (error) {
    throw error;
  }

  const totals =
  await recalculatePurchaseOrder(
    values.purchase_order_id
  );

return {
  success: true,
  ...totals,
};
}