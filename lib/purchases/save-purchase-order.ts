import { createClient } from "@/lib/supabase/server";

export async function savePurchaseOrder(
  purchaseOrderId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select("id")
    .eq("id", purchaseOrderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}