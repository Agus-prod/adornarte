import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogBrand =
  Tables<"brands">;

export async function getCatalogBrands(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("organization_id", organizationId)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies CatalogBrand[];
}

export async function getActiveCatalogBrands(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies CatalogBrand[];
}

export async function getCatalogBrandById(
  brandId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", brandId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies CatalogBrand;
}

export async function getCatalogBrandBySlug(
  organizationId: string,
  slug: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogBrand | null;
}

export async function createCatalogBrand(
  values: TablesInsert<"brands">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCatalogBrand(
  brandId: string,
  organizationId: string,
  values: TablesUpdate<"brands">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .update(values)
    .eq("id", brandId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCatalogBrand(
  brandId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", brandId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function getCatalogProductsByBrand(
  brandId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("brand_id", brandId)
    .order("name");

  if (error) throw error;

  return data;
}
