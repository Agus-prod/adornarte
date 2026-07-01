import { createClient } from "@/lib/supabase/server";

export async function getDefaultVariant(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("is_default", true)
    .single();

  if (error) throw error;

  return data;
}