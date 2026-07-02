import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type ProductVariant =
  Tables<"product_variants">;

export async function getVariants(
  productId: string,
  organizationId?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("is_default", {
      ascending: false,
    })
    .order("name");

  if (organizationId) {
    query = query.eq(
      "organization_id",
      organizationId
    );
  }

  const { data, error } =
    await query;

  if (error) throw error;

  return data satisfies ProductVariant[];
}

export async function getVariant(
  id: string,
  organizationId?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from("product_variants")
    .select("*")
    .eq("id", id);

  if (organizationId) {
    query = query.eq(
      "organization_id",
      organizationId
    );
  }

  const { data, error } = await query.single();

  if (error) throw error;

  return data satisfies ProductVariant;
}

export async function createVariant(
  values: TablesInsert<"product_variants">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_variants")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateVariant(
  id: string,
  values: TablesUpdate<"product_variants">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_variants")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteVariant(
  id: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function setDefaultVariant(
  productId: string,
  variantId: string
) {
  const supabase = await createClient();

  const { error: resetError } =
    await supabase
      .from("product_variants")
      .update({
        is_default: false,
      })
      .eq("product_id", productId);

  if (resetError) throw resetError;

  const { error } = await supabase
    .from("product_variants")
    .update({
      is_default: true,
    })
    .eq("id", variantId);

  if (error) throw error;
}
