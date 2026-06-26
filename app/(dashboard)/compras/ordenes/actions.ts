"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";

import {
  purchaseOrderSchema,
  PurchaseOrderFormValues,
} from "@/lib/purchases/purchase-order-schema";

import { createPurchaseOrder } from "@/lib/purchases/purchase-order-repository";

export async function createPurchaseOrderAction(
  values: PurchaseOrderFormValues
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "Usuario no autenticado.",
    };
  }

  const parsed =
    purchaseOrderSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
    };
  }

  try {
    const order =
      await createPurchaseOrder(
        profile.organization_id,
        profile.id,
        parsed.data
      );

    revalidatePath("/compras");

    return {
      success: true,
      message: "Orden creada correctamente.",
      id: order.id,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "No fue posible crear la orden.",
    };
  }
}