import { createClient } from "@/lib/supabase/server";

export async function recalculatePurchaseOrder(
  purchaseOrderId: string
) {
  const supabase = await createClient();

  const { data: items, error } =
    await supabase
      .from("purchase_order_items")
      .select("subtotal")
      .eq(
        "purchase_order_id",
        purchaseOrderId
      );

  if (error) {
    throw error;
  }

  const subtotal =
    (items ?? []).reduce(
      (sum, item) =>
        sum + item.subtotal,
      0
    );

  // Próximamente aquí calcularemos:
  // IVA
  // descuentos
  // retenciones
  // envío

  const tax = 0;

  const total =
    subtotal + tax;

  const { error: updateError } =
    await supabase
      .from("purchase_orders")
      .update({
        subtotal,
        tax,
        total,
      })
      .eq(
        "id",
        purchaseOrderId
      );

  if (updateError) {
    throw updateError;
  }

  return {
    subtotal,
    tax,
    total,
  };
}