"use server";

import { revalidatePath } from "next/cache";
import {
  createProductVariant as createProductVariantService,
  deleteProductVariant as deleteProductVariantService,
  setDefaultProductVariant as setDefaultProductVariantService,
  updateProductVariant as updateProductVariantService,
} from "@/lib/catalog/services/variant-service";

function revalidateProductEditor(
  productId: string
) {
  revalidatePath(
    `/inventario/productos/${productId}/editar`
  );
}

export async function createProductVariant(
  productId: string,
  formData: FormData
) {
  await createProductVariantService(
    productId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  formData: FormData
) {
  await updateProductVariantService(
    productId,
    variantId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function deleteProductVariant(
  productId: string,
  variantId: string
) {
  await deleteProductVariantService(
    productId,
    variantId
  );

  revalidateProductEditor(productId);
}

export async function setDefaultProductVariant(
  productId: string,
  variantId: string
) {
  await setDefaultProductVariantService(
    productId,
    variantId
  );

  revalidateProductEditor(productId);
}
