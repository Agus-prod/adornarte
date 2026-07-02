"use server";

import { revalidatePath } from "next/cache";
import { updateProductPublicationForEditor } from "@/lib/catalog/services/publication-service";

function revalidateProductEditor(
  productId: string
) {
  revalidatePath(
    `/inventario/productos/${productId}/editar`
  );
}

export async function updateProductPublication(
  productId: string,
  formData: FormData
) {
  await updateProductPublicationForEditor(
    productId,
    formData
  );

  revalidateProductEditor(productId);
}
