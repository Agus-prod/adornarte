import { createClient } from "@/lib/supabase/server";
import { recalculatePurchaseOrder } from "./recalculate-purchase-order";

export async function deletePurchaseItem(
  itemId: string
) {
  const supabase = await createClient();

  // Buscar el item
  const { data: item, error } =
    await supabase
      .from("purchase_order_items")
      .select(`
        purchase_order_id
      `)
      .eq("id", itemId)
      .single();

  if (error) {
    throw error;
  }

  // Eliminar
  const { error: deleteError } =
    await supabase
      .from("purchase_order_items")
      .delete()
      .eq("id", itemId);

  if (deleteError) {
    throw deleteError;
  }

  // Recalcular
  await recalculatePurchaseOrder(
  item.purchase_order_id
);

return item.purchase_order_id;
}