import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type ProductImage =
  Tables<"product_images">;

const bucketName = "product-images";

export async function getImages(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .eq("organization_id", organizationId)
    .order("sort_order")
    .order("created_at");

  if (error) throw error;

  return data satisfies ProductImage[];
}

export async function getImage(
  imageId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("id", imageId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies ProductImage;
}

export async function createImage(
  values: TablesInsert<"product_images">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_images")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateImage(
  imageId: string,
  values: TablesUpdate<"product_images">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("product_images")
    .update(values)
    .eq("id", imageId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteImage(
  imageId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) throw error;
}

export async function clearPrimaryImages(
  productId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("product_images")
    .update({
      is_primary: false,
    })
    .eq("product_id", productId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function uploadProductImage(
  path: string,
  file: File
) {
  const supabase = createAdminClient();

  const { data, error } =
    await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        upsert: false,
      });

  if (error) throw error;

  return data;
}

export async function removeProductImageFile(
  path: string
) {
  const supabase = createAdminClient();

  const { error } =
    await supabase.storage
      .from(bucketName)
      .remove([path]);

  if (error) throw error;
}

export async function getProductImagePublicUrl(
  path: string
) {
  const supabase = createAdminClient();

  const { data } =
    supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

  return data.publicUrl;
}

export async function updateProductPrimaryImage(
  productId: string,
  organizationId: string,
  imageUrl: string | null
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update({
      image_url: imageUrl,
    })
    .eq("id", productId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}
