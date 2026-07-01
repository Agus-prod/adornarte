import { createClient } from "@/lib/supabase/server";

export async function getCatalogProducts() {
  const supabase = await createClient();

  return supabase
    .from("products")
    .select("*")
    .order("name");
}