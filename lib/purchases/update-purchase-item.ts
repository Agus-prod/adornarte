import { createClient } from "@/lib/supabase/server";
import { recalculatePurchaseOrder } from "./recalculate-purchase-order";

type UpdatePurchaseItemInput = {
  itemId: string;
  quantity: number;
  cost_price: number;
};

export async function updatePurchaseItem({
  itemId,
  quantity,
  cost_price,
}: UpdatePurchaseItemInput) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("purchase_order_items")
    .select("purchase_order_id")
    .eq("id", itemId)
    .single();

  if (error) {
    throw error;
  }

  const subtotal = quantity * cost_price;

  const { error: updateError } = await supabase
    .from("purchase_order_items")
    .update({
      quantity,
      cost_price,
      subtotal,
    })
    .eq("id", itemId);

  if (updateError) {
    throw updateError;
  }

  await recalculatePurchaseOrder(
    item.purchase_order_id
  );

  return item.purchase_order_id;
}