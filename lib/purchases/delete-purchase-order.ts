import { createClient } from "@/lib/supabase/server";

export async function deletePurchaseOrder(
  purchaseOrderId: string
) {
  const supabase = await createClient();

  // Obtener estado
  const { data: order, error } =
    await supabase
      .from("purchase_orders")
      .select("status")
      .eq("id", purchaseOrderId)
      .single();

  if (error) {
    throw error;
  }

  if (order.status !== "draft") {
    throw new Error(
      "Solo se pueden eliminar órdenes en edición."
    );
  }

  // Eliminar productos
  const { error: itemsError } =
    await supabase
      .from("purchase_order_items")
      .delete()
      .eq(
        "purchase_order_id",
        purchaseOrderId
      );

  if (itemsError) {
    throw itemsError;
  }

  // Eliminar orden
  const { error: orderError } =
    await supabase
      .from("purchase_orders")
      .delete()
      .eq("id", purchaseOrderId);

  if (orderError) {
    throw orderError;
  }
}