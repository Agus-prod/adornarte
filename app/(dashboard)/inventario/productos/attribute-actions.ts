"use server";

import { revalidatePath } from "next/cache";
import {
  createProductAttribute as createProductAttributeService,
  deleteProductAttribute as deleteProductAttributeService,
  updateProductAttribute as updateProductAttributeService,
} from "@/lib/catalog/services/attribute-service";

function revalidateProductEditor(
  productId: string
) {
  revalidatePath(
    `/inventario/productos/${productId}/editar`
  );
}

export async function createProductAttribute(
  productId: string,
  formData: FormData
) {
  await createProductAttributeService(
    productId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function updateProductAttribute(
  productId: string,
  attributeId: string,
  formData: FormData
) {
  await updateProductAttributeService(
    productId,
    attributeId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function deleteProductAttribute(
  productId: string,
  attributeId: string
) {
  await deleteProductAttributeService(
    productId,
    attributeId
  );

  revalidateProductEditor(productId);
}
