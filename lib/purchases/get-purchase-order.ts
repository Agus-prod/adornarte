import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getPurchaseOrder(id: string) {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error("Usuario no autenticado.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      *,
      supplier:suppliers (
        id,
        name,
        contact_name,
        phone,
        email
      ),
      items:purchase_order_items (
        id,
        quantity,
        cost_price,
        subtotal,
        product:products (
          id,
          name,
          sku
        )
      )
    `)
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}