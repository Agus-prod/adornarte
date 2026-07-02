"use server";

import { revalidatePath } from "next/cache";
import {
  deleteProductImageForEditor,
  setPrimaryProductImageForEditor,
  updateProductImageForEditor,
  uploadProductImageForEditor,
} from "@/lib/catalog/services/image-service";

function revalidateProductEditor(
  productId: string
) {
  revalidatePath(
    `/inventario/productos/${productId}/editar`
  );
}

export async function uploadProductImage(
  productId: string,
  formData: FormData
) {
  await uploadProductImageForEditor(
    productId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  formData: FormData
) {
  await updateProductImageForEditor(
    productId,
    imageId,
    formData
  );

  revalidateProductEditor(productId);
}

export async function deleteProductImage(
  productId: string,
  imageId: string
) {
  await deleteProductImageForEditor(
    productId,
    imageId
  );

  revalidateProductEditor(productId);
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string
) {
  await setPrimaryProductImageForEditor(
    productId,
    imageId
  );

  revalidateProductEditor(productId);
}
