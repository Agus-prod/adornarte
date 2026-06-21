"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function createProduct(
  formData: FormData
) {
  const supabase = await createClient();

  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const name =
    formData.get("name")?.toString() ?? "";

  const sku =
    formData.get("sku")?.toString() ?? "";

  const sale_price = Number(
    formData.get("sale_price") ?? 0
  );

  const stock = Number(
    formData.get("stock") ?? 0
  );

  const { error } = await supabase
    .from("products")
    .insert({
      organization_id:
        profile.organization_id,

      name,
      sku,
      sale_price,
      stock,
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/inventario/productos");
}