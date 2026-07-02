import { createClient } from "@/lib/supabase/server";

export async function getCatalogProducts() {
  const supabase = await createClient();

  return supabase
    .from("products")
    .select("*")
    .order("name");
}

export async function getCatalogProductById(
  productId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data;
}
