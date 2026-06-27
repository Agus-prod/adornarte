import { createClient } from "@/lib/supabase/server";

import {
  PurchaseOrderFormValues,
} from "./purchase-order-schema";

export async function createPurchaseOrder(
  organizationId: string,
  userId: string,
  values: PurchaseOrderFormValues
) {
  const supabase = await createClient();

  // Obtener última orden

 const { data: lastOrder } = await supabase
  .from("purchase_orders")
  .select("number")
  .eq("organization_id", organizationId)
  .order("created_at", {
    ascending: false,
  })
  .limit(1)
  .maybeSingle() as {
    data: { number: string } | null;
    error: unknown;
  };

  let nextNumber = "OC-000001";

  if (lastOrder?.number) {
    const current =
      Number(
        lastOrder.number.replace("OC-", "")
      ) + 1;

    nextNumber =
      `OC-${current
        .toString()
        .padStart(6, "0")}`;
  }

const { data, error } = await supabase
  .from("purchase_orders")
  .insert({
    organization_id: organizationId,
    supplier_id: values.supplier_id,
    number: nextNumber,
    order_date: values.order_date,
    notes: values.notes || null,
    created_by: userId,
    status: "draft", // <-- agregar esto
  })
  .select()
  .single();

  if (error) throw error;

  return data;
}