import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type ActiveProduct = {
  id: string;
  name: string;
  sku: string | null;
  sale_price: number;
};

export async function getActiveProducts() {
  const profile = await getCurrentProfile();

  if (!profile) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      sale_price
    `)
    .eq("organization_id", profile.organization_id)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data as ActiveProduct[];
}