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

  const sale_price = Number(
    formData.get("sale_price")
  );

  const stock = Number(
    formData.get("stock")
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
    throw error;
  }
}