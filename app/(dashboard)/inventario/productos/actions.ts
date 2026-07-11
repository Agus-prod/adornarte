"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database.types";

function readText(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ""
  ).trim();
}

function readOptionalText(
  formData: FormData,
  key: string
) {
  const value = readText(formData, key);

  return value || null;
}

function readNumber(
  formData: FormData,
  key: string
) {
  const value = Number(
    formData.get(key) ?? 0
  );

  return Number.isFinite(value)
    ? value
    : 0;
}

function readValues(
  formData: FormData,
  key: string
) {
  return formData
    .getAll(key)
    .map((value) =>
      String(value).trim()
    );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getOptionalDate(value: string) {
  return value
    ? new Date(value).toISOString()
    : null;
}

export async function createProduct(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();
  const name = readText(
    formData,
    "name"
  );
  const imageUrls = readValues(
    formData,
    "image_url"
  ).filter(Boolean);

  const { data, error } =
    await supabase
      .from("products")
      .insert({
        organization_id:
          profile.organization_id,

        name,

        sku: readText(
          formData,
          "sku"
        ),

        barcode: readOptionalText(
          formData,
          "barcode"
        ),

        description: readText(
          formData,
          "description"
        ),

        category_id: readOptionalText(
          formData,
          "category_id"
        ),

        brand_id: readOptionalText(
          formData,
          "brand_id"
        ),

        cost_price: readNumber(
          formData,
          "cost_price"
        ),

        sale_price: readNumber(
          formData,
          "sale_price"
        ),

        offer_price: readNumber(
          formData,
          "offer_price"
        ),

        stock: readNumber(
          formData,
          "stock"
        ),

        min_stock: readNumber(
          formData,
          "min_stock"
        ),

        is_featured:
          formData.get(
            "is_featured"
          ) === "on",

        image_url: imageUrls[0] ?? null,
        is_active: true,
      })
      .select("id")
      .single();

  if (error) {
    throw error;
  }

  const productId = data.id;
  const variantNames = readValues(
    formData,
    "variant_name"
  );
  const variantSkus = readValues(
    formData,
    "variant_sku"
  );
  const variantBarcodes = readValues(
    formData,
    "variant_barcode"
  );
  const variantStocks = readValues(
    formData,
    "variant_stock"
  );
  const variantCosts = readValues(
    formData,
    "variant_cost_price"
  );
  const variantPrices = readValues(
    formData,
    "variant_sale_price"
  );
  const defaultVariantIndex = Number(
    formData.get("default_variant_index") ?? 0
  );
  const variants: TablesInsert<"product_variants">[] =
    variantNames
      .map((variantName, index) => ({
        organization_id:
          profile.organization_id,
        product_id: productId,
        name: variantName,
        sku: variantSkus[index] || null,
        barcode:
          variantBarcodes[index] || null,
        stock: Number(
          variantStocks[index] || 0
        ),
        cost_price: Number(
          variantCosts[index] || 0
        ),
        sale_price: Number(
          variantPrices[index] || 0
        ),
        active: true,
        is_default:
          index === defaultVariantIndex,
      }))
      .filter(
        (variant) =>
          variant.name.trim() !== ""
      );

  if (variants.length > 0) {
    const hasDefault = variants.some(
      (variant) => variant.is_default
    );

    if (!hasDefault) {
      variants[0].is_default = true;
    }

    const { error: variantsError } =
      await supabase
        .from("product_variants")
        .insert(variants);

    if (variantsError) {
      throw variantsError;
    }
  }

  const attributeTypes = readValues(
    formData,
    "attribute_type"
  );
  const attributeNames = readValues(
    formData,
    "attribute_name"
  );
  const attributeValues = readValues(
    formData,
    "attribute_value"
  );
  const attributes: TablesInsert<"product_attributes">[] =
    attributeNames
      .map((attributeName, index) => ({
        organization_id:
          profile.organization_id,
        product_id: productId,
        type:
          attributeTypes[index] || "custom",
        name: attributeName,
        value:
          attributeValues[index] ?? "",
        sort_order: index,
      }))
      .filter(
        (attribute) =>
          attribute.name.trim() !== "" &&
          attribute.value.trim() !== ""
      );

  if (attributes.length > 0) {
    const { error: attributesError } =
      await supabase
        .from("product_attributes")
        .insert(attributes);

    if (attributesError) {
      throw attributesError;
    }
  }

  if (imageUrls.length > 0) {
    const images: TablesInsert<"product_images">[] =
      imageUrls.map((url, index) => ({
        organization_id:
          profile.organization_id,
        product_id: productId,
        url,
        path: url,
        alt_text:
          readText(
            formData,
            "name"
          ) || null,
        sort_order: index,
        is_primary: index === 0,
      }));
    const { error: imagesError } =
      await supabase
        .from("product_images")
        .insert(images);

    if (imagesError) {
      throw imagesError;
    }
  }

  const publicationStatus = readText(
    formData,
    "publication_status"
  );

  if (publicationStatus) {
    const slug =
      slugify(
        readText(
          formData,
          "publication_slug"
        )
      ) ||
      slugify(name) ||
      productId;
    const now = new Date().toISOString();
    const publishedAt =
      publicationStatus === "published"
        ? now
        : publicationStatus === "scheduled"
          ? getOptionalDate(
              readText(
                formData,
                "published_at"
              )
            )
          : null;
    const publication: TablesInsert<"product_publications"> =
      {
        organization_id:
          profile.organization_id,
        product_id: productId,
        slug,
        status: publicationStatus,
        is_visible:
          formData.get(
            "publication_visible"
          ) === "on",
        is_featured:
          formData.get(
            "publication_featured"
          ) === "on",
        meta_title:
          readOptionalText(
            formData,
            "meta_title"
          ) ?? name,
        meta_description:
          readOptionalText(
            formData,
            "meta_description"
          ),
        published_at: publishedAt,
        expires_at: getOptionalDate(
          readText(
            formData,
            "expires_at"
          )
        ),
      };

    const { error: publicationError } =
      await supabase
        .from("product_publications")
        .insert(publication);

    if (publicationError) {
      throw publicationError;
    }
  }

  revalidatePath(
    "/inventario/productos"
  );

  redirect(
    `/inventario/productos/${productId}/editar`
  );
}

export async function updateProduct(
  id: string,
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("products")
      .update({
        name:
          formData
            .get("name")
            ?.toString() ?? "",

        sku:
          formData
            .get("sku")
            ?.toString() ?? "",

        description:
          formData
            .get("description")
            ?.toString() ?? "",

        category_id:
          formData
            .get("category_id")
            ?.toString() || null,

        brand_id:
          formData
            .get("brand_id")
            ?.toString() || null,

        cost_price: Number(
          formData.get(
            "cost_price"
          ) || 0
        ),

        sale_price: Number(
          formData.get(
            "sale_price"
          ) || 0
        ),

        offer_price: Number(
          formData.get(
            "offer_price"
          ) || 0
        ),

        stock: Number(
          formData.get(
            "stock"
          ) || 0
        ),

        min_stock: Number(
          formData.get(
            "min_stock"
          ) || 0
        ),

        is_featured:
          formData.get(
            "is_featured"
          ) === "on",
      })
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    throw error;
  }

  revalidatePath(
    "/inventario/productos"
  );

  redirect(
    "/inventario/productos"
  );
}

export async function deleteProduct(
  id: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const {
    data: salesItems,
    error: salesError,
  } = await supabase
    .from("sale_items")
    .select("id")
    .eq("product_id", id)
    .limit(1);

  if (salesError) {
    throw salesError;
  }

  if (
    salesItems &&
    salesItems.length > 0
  ) {
    const { error } =
      await supabase
        .from("products")
        .update({
          is_active: false,
        })
        .eq("id", id)
        .eq(
          "organization_id",
          profile.organization_id
        );

    if (error) {
      throw error;
    }

    revalidatePath(
      "/inventario/productos"
    );

    redirect(
      "/inventario/productos"
    );
  }

  const { error } =
    await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    throw error;
  }

  revalidatePath(
    "/inventario/productos"
  );

  redirect(
    "/inventario/productos"
  );
}

export async function deleteProductFromForm(
  formData: FormData
) {
  const id =
    formData.get("product_id")?.toString() ??
    "";

  if (!id) {
    throw new Error("Producto inválido");
  }

  await deleteProduct(id);
}
