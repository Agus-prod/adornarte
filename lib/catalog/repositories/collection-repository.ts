import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type Collection =
  Tables<"collections">;

export type CollectionProduct =
  Tables<"collection_products">;

export async function getCollections(
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("organization_id", organizationId)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies Collection[];
}

export async function getFeaturedCollections(
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;

  return data satisfies Collection[];
}

export async function getCollectionById(
  collectionId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies Collection;
}

export async function getCollectionBySlug(
  organizationId: string,
  slug: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  return data satisfies Collection | null;
}

export async function createCollection(
  values: TablesInsert<"collections">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCollection(
  collectionId: string,
  organizationId: string,
  values: TablesUpdate<"collections">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .update(values)
    .eq("id", collectionId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCollection(
  collectionId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function getCollectionProducts(
  collectionId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_products")
    .select("*")
    .eq("collection_id", collectionId)
    .eq("organization_id", organizationId)
    .order("sort_order");

  if (error) throw error;

  return data satisfies CollectionProduct[];
}

export async function addCollectionProduct(
  values: TablesInsert<"collection_products">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_products")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCollectionProduct(
  collectionProductId: string,
  organizationId: string,
  values: TablesUpdate<"collection_products">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_products")
    .update(values)
    .eq("id", collectionProductId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function removeCollectionProduct(
  collectionProductId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collection_products")
    .delete()
    .eq("id", collectionProductId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}
