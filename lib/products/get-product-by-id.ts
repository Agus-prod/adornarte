import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { ProductsRepository } from "@/lib/repositories/products.repository";

export async function getProductById(
  id: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const product =
    await ProductsRepository.findById(id);

  if (
    !product ||
    product.organization_id !==
      profile.organization_id
  ) {
    throw new Error(
      "Producto no encontrado."
    );
  }

  return product;
}