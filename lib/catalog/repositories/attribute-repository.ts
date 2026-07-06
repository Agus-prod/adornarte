import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type ProductAttribute =
  Tables<"product_attributes">;

export async function getAttributes(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_attributes")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies ProductAttribute[];
}

export async function getAttribute(
  attributeId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_attributes")
    .select("*")
    .eq("id", attributeId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies ProductAttribute;
}

export async function createAttribute(
  values: TablesInsert<"product_attributes">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_attributes")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateAttribute(
  attributeId: string,
  values: TablesUpdate<"product_attributes">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_attributes")
    .update(values)
    .eq("id", attributeId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteAttribute(
  attributeId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("product_attributes")
    .delete()
    .eq("id", attributeId);

  if (error) throw error;
}
