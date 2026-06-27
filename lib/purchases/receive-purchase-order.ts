import { createClient } from "@/lib/supabase/server";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function receivePurchaseOrder(
  purchaseOrderId: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const supabase =
    await createClient();

  const { data: order, error } =
    await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", purchaseOrderId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

  if (error) {
    throw error;
  }

  if (order.status !== "draft") {
    throw new Error(
      "La orden ya fue recibida."
    );
  }

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("purchase_order_items")
    .select("*")
    .eq(
      "purchase_order_id",
      purchaseOrderId
    );

  if (itemsError) {
    throw itemsError;
  }

  if (!items?.length) {
    throw new Error(
      "La orden no tiene productos."
    );
  }

  // Aquí comenzaremos el proceso
}
