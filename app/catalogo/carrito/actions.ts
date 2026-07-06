"use server";

import { revalidatePath } from "next/cache";
import {
  addCatalogCartItemFromForm,
  applyCouponToCart,
  removeCouponFromCart,
  removeCatalogCartItem,
  updateCatalogCartItemFromForm,
} from "@/lib/catalog/services/cart-service";

export type CatalogCouponActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function addCatalogCartItem(
  formData: FormData
) {
  await addCatalogCartItemFromForm(
    formData
  );

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
}

export async function updateCatalogCartItem(
  itemId: string,
  formData: FormData
) {
  await updateCatalogCartItemFromForm(
    itemId,
    formData
  );

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
}

export async function removeCatalogCartItemAction(
  itemId: string
) {
  await removeCatalogCartItem(itemId);

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
}

export async function applyCatalogCoupon(
  _state: CatalogCouponActionState,
  formData: FormData
): Promise<CatalogCouponActionState> {
  try {
    await applyCouponToCart(formData);
  } catch (error) {
    return {
      status: "error",
      message: getCouponErrorMessage(error),
    };
  }

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");

  return {
    status: "success",
    message: "Cupon aplicado.",
  };
}

export async function removeCatalogCoupon() {
  await removeCouponFromCart();

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
}

function getCouponErrorMessage(
  error: unknown
) {
  if (
    error instanceof Error &&
    error.message === "Cupon no valido."
  ) {
    return "Cupon no valido. Revisa el codigo e intenta de nuevo.";
  }

  return "No se pudo aplicar el cupon. Intenta de nuevo.";
}
