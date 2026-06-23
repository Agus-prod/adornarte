"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";

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

  const { error } =
    await supabase
      .from("products")
      .insert({
        organization_id:
          profile.organization_id,

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

        is_active: true,
      });

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