"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProduct(
  formData: FormData
) {
  const supabase = await createClient();

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
      "2013e678-30b5-4f62-8c89-925168284cc1",

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