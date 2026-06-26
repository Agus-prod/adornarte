import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type PurchaseOrder = {
  id: string;
  number: string;
  status: string;
  order_date: string;
  total: number;
  supplier: {
    name: string;
  };
};

export async function getPurchaseOrders() {
  const profile = await getCurrentProfile();

  if (!profile) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
  .from("purchase_orders")
  .select(`
    id,
    number,
    status,
    order_date,
    total,
    supplier:suppliers (
      name
    )
  `)
  .eq("organization_id", profile.organization_id)
  .order("created_at", { ascending: false });

if (error) {
  console.error(error);
  return [];
}

return (data ?? []) as unknown as PurchaseOrder[];
}