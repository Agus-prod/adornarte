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
    formData.get("sale_price")
  );

  const stock = Number(
    formData.get("stock")
  );

  const { error } = await supabase
    .from("products")
    .insert({
      name,
      sku,
      sale_price,
      stock,
    });

  if (error) {
    throw error;
  }
}