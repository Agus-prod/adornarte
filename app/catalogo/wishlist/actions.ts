"use server";

import { revalidatePath } from "next/cache";
import {
  addWishlistItemFromForm,
  removeWishlistItemFromForm,
} from "@/lib/catalog/services/wishlist-service";

export async function addWishlistItem(
  formData: FormData
) {
  await addWishlistItemFromForm(
    formData
  );

  revalidatePath("/catalogo/wishlist");
}

export async function removeWishlistItem(
  formData: FormData
) {
  await removeWishlistItemFromForm(
    formData
  );

  revalidatePath("/catalogo/wishlist");
}
