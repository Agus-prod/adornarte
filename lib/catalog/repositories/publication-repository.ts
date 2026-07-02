import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type ProductPublication =
  Tables<"product_publications">;

export async function getPublication(
  productId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_publications")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throw error;

  return data satisfies ProductPublication | null;
}

export async function createPublication(
  values: TablesInsert<"product_publications">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_publications")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updatePublication(
  publicationId: string,
  values: TablesUpdate<"product_publications">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_publications")
    .update(values)
    .eq("id", publicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
