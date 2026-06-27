"use server";

import { revalidatePath } from "next/cache";

import {
  purchaseItemSchema,
  PurchaseItemFormValues,
} from "@/lib/purchases/purchase-item-schema";

import { addPurchaseItem } from "@/lib/purchases/purchase-item-repository";

export async function addPurchaseItemAction(
  values: PurchaseItemFormValues
) {
  const parsed =
    purchaseItemSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
    };
  }

  try {
    await addPurchaseItem(parsed.data);

    revalidatePath(
      `/compras/ordenes/${values.purchase_order_id}`
    );

    return {
      success: true,
      message: "Producto agregado correctamente.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "No fue posible agregar el producto.",
    };
  }
}