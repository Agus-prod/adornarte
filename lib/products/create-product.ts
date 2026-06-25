import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { ProductsRepository } from "@/lib/repositories/products.repository";

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

  await ProductsRepository.create({
    organization_id:
      profile.organization_id,

    name,

    sku,

    sale_price,

    stock,
  });
}