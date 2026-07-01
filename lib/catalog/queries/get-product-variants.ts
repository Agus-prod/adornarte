import { createClient } from "@/lib/supabase/server";

export async function getProductVariants(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("created_at");

  if (error) throw error;

  return data;
}