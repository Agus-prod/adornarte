"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

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

  const name =
    formData.get("name")?.toString() ?? "";

  const sku =
    formData.get("sku")?.toString() ?? "";

  const description =
    formData.get("description")?.toString() ??
    "";

  const category_id =
    formData.get("category_id")?.toString() ||
    null;

  const brand_id =
    formData.get("brand_id")?.toString() ||
    null;

  const cost_price = Number(
    formData.get("cost_price") || 0
  );

  const sale_price = Number(
    formData.get("sale_price") || 0
  );

  const offer_price = Number(
    formData.get("offer_price") || 0
  );

  const stock = Number(
    formData.get("stock") || 0
  );

  const min_stock = Number(
    formData.get("min_stock") || 0
  );

  const { error } = await supabase
    .from("products")
    .insert({
      organization_id:
        profile.organization_id,

      name,
      sku,
      description,

      category_id,
      brand_id,

      cost_price,
      sale_price,
      offer_price,

      stock,
      min_stock,

      is_active: true,
      is_featured: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/inventario/productos");
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
      })
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    throw error;
  }

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

  redirect(
    "/inventario/productos"
  );
}