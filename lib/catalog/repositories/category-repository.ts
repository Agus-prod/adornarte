import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogCategory =
  Tables<"categories">;

export async function getCatalogCategories(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("organization_id", organizationId)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies CatalogCategory[];
}

export async function getActiveCatalogCategories(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies CatalogCategory[];
}

export async function getCatalogCategoryById(
  categoryId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies CatalogCategory;
}

export async function getCatalogCategoryBySlug(
  organizationId: string,
  slug: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogCategory | null;
}

export async function createCatalogCategory(
  values: TablesInsert<"categories">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCatalogCategory(
  categoryId: string,
  organizationId: string,
  values: TablesUpdate<"categories">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("categories")
    .update(values)
    .eq("id", categoryId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCatalogCategory(
  categoryId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function getCatalogProductsByCategory(
  categoryId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("category_id", categoryId)
    .order("name");

  if (error) throw error;

  return data;
}
