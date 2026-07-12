"use server";

import { revalidatePath } from "next/cache";
import {
  addCatalogCartItemFromForm,
  applyCouponToCart,
  clearCatalogCart,
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
  revalidatePath("/catalogo/checkout");
}

export async function addCatalogComboItems(
  formData: FormData
) {
  const productIds = formData
    .getAll("product_id")
    .map((value) => String(value))
    .filter(Boolean);

  for (const productId of productIds) {
    const itemFormData = new FormData();
    itemFormData.set(
      "product_id",
      productId
    );
    itemFormData.set("quantity", "1");

    await addCatalogCartItemFromForm(
      itemFormData
    );
  }

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
  revalidatePath("/catalogo/checkout");
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
  revalidatePath("/catalogo/checkout");
}

export async function removeCatalogCartItemAction(
  itemId: string
) {
  await removeCatalogCartItem(itemId);

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
  revalidatePath("/catalogo/checkout");
}

export async function clearCatalogCartAction() {
  await clearCatalogCart();

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
  revalidatePath("/catalogo/checkout");
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
  revalidatePath("/catalogo/checkout");

  return {
    status: "success",
    message: "Cupon aplicado.",
  };
}

export async function removeCatalogCoupon() {
  await removeCouponFromCart();

  revalidatePath("/catalogo", "layout");
  revalidatePath("/catalogo/carrito");
  revalidatePath("/catalogo/checkout");
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
