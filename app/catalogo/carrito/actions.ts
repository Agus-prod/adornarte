"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addCatalogCartItemFromForm,
  removeCatalogCartItem,
  updateCatalogCartItemFromForm,
} from "@/lib/catalog/services/cart-service";

export async function addCatalogCartItem(
  formData: FormData
) {
  await addCatalogCartItemFromForm(
    formData
  );

  revalidatePath("/catalogo/carrito");
  redirect("/catalogo/carrito");
}

export async function updateCatalogCartItem(
  itemId: string,
  formData: FormData
) {
  await updateCatalogCartItemFromForm(
    itemId,
    formData
  );

  revalidatePath("/catalogo/carrito");
}

export async function removeCatalogCartItemAction(
  itemId: string
) {
  await removeCatalogCartItem(itemId);

  revalidatePath("/catalogo/carrito");
}
