import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type PendingPurchaseOrder = {
  id: string;
  number: string;
  order_date: string;
  total: number;
  supplier: {
    name: string;
  };
};

export async function getPendingPurchaseOrders() {
  const profile = await getCurrentProfile();

  if (!profile) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      id,
      number,
      order_date,
      total,
      supplier:suppliers (
        name
      )
    `)
    .eq("organization_id", profile.organization_id)
    .eq("status", "sent")
    .order("order_date", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data as PendingPurchaseOrder[];
}