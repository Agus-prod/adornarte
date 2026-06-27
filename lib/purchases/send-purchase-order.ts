import { createClient } from "@/lib/supabase/server";

export async function sendPurchaseOrder(
  purchaseOrderId: string
) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("purchase_orders")
    .select(`
      id,
      status,
      total,
      purchase_order_items(id)
    `)
    .eq("id", purchaseOrderId)
    .single();

  if (error) throw error;

  if (order.status !== "draft") {
    throw new Error(
      "La orden ya fue enviada."
    );
  }

  if ((order.purchase_order_items ?? []).length === 0) {
    throw new Error(
      "Agregue al menos un producto."
    );
  }

  if (Number(order.total) <= 0) {
    throw new Error(
      "El total debe ser mayor que cero."
    );
  }

  const { error: updateError } =
    await supabase
      .from("purchase_orders")
      .update({
        status: "sent",
      })
      .eq("id", purchaseOrderId);

  if (updateError) throw updateError;
}