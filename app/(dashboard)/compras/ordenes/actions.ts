"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";

import {
  purchaseOrderSchema,
  PurchaseOrderFormValues,
} from "@/lib/purchases/purchase-order-schema";

import { createPurchaseOrder } from "@/lib/purchases/purchase-order-repository";

import {
  purchaseItemSchema,
  PurchaseItemFormValues,
} from "@/lib/purchases/purchase-item-schema";

import { addPurchaseItem } from "@/lib/purchases/purchase-item-repository";
import { deletePurchaseItem } from "@/lib/purchases/delete-purchase-item";
import { updatePurchaseItem } from "@/lib/purchases/update-purchase-item";
import { deletePurchaseOrder } from "@/lib/purchases/delete-purchase-order";
import { savePurchaseOrder } from "@/lib/purchases/save-purchase-order";
import { sendPurchaseOrder } from "@/lib/purchases/send-purchase-order";

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
      error instanceof Error
        ? error.message
        : "No fue posible agregar el producto.",
  };
}
}
export async function deletePurchaseItemAction(
  itemId: string
) {
  try {
    const purchaseOrderId =
      await deletePurchaseItem(itemId);

    revalidatePath(
      `/compras/ordenes/${purchaseOrderId}`
    );

    return {
      success: true,
      message:
        "Producto eliminado correctamente.",
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible eliminar el producto.",
    };
  }
}
export async function updatePurchaseItemAction(
  itemId: string,
  quantity: number,
  costPrice: number
) {
  if (quantity <= 0) {
    return {
      success: false,
      message: "La cantidad debe ser mayor que cero.",
    };
  }

  if (costPrice <= 0) {
    return {
      success: false,
      message: "El costo debe ser mayor que cero.",
    };
  }

  try {
    const purchaseOrderId =
      await updatePurchaseItem({
        itemId,
        quantity,
        cost_price: costPrice,
      });

    revalidatePath(
      `/compras/ordenes/${purchaseOrderId}`
    );

    return {
      success: true,
      message:
        "Producto actualizado correctamente.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el producto.",
    };
  }
}
export async function receivePurchaseOrderAction(
  purchaseOrderId: string
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "Usuario no autenticado.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc(
  "receive_purchase_order",
  {
    p_purchase_order_id: purchaseOrderId,
    p_received_by: profile.id,
  }
);

if (error) {
  console.error("RPC ERROR");
  console.dir(error, { depth: null });
  throw error;
}

    revalidatePath(
      `/compras/ordenes/${purchaseOrderId}`
    );

    return {
      success: true,
      message: "Orden recibida correctamente.",
    };
  } catch (error) {
  console.error("RECEIVE PURCHASE ORDER");
  console.dir(error, { depth: null });

  return {
    success: false,
    message:
      error instanceof Error
        ? error.message
        : JSON.stringify(error),
  };
}
}
export async function deletePurchaseOrderAction(
  purchaseOrderId: string
) {
  try {
    await deletePurchaseOrder(
      purchaseOrderId
    );

    revalidatePath("/compras/ordenes");

    return {
      success: true,
      message:
        "Orden eliminada correctamente.",
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible eliminar la orden.",
    };
  }
}
export async function savePurchaseOrderAction(
  purchaseOrderId: string
) {
  try {
    await savePurchaseOrder(
      purchaseOrderId
    );

    revalidatePath("/compras/ordenes");
    revalidatePath(
      `/compras/ordenes/${purchaseOrderId}`
    );

    return {
      success: true,
      message: "Orden enviada a recepción.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible guardar la orden.",
    };
  }
}
export async function sendPurchaseOrderAction(
  purchaseOrderId: string
) {
  try {
    await sendPurchaseOrder(
      purchaseOrderId
    );

    revalidatePath("/compras/ordenes");

    revalidatePath(
      `/compras/ordenes/${purchaseOrderId}`
    );

    revalidatePath("/compras/recepcion");

    return {
      success: true,
      message: "Orden enviada correctamente.",
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible enviar la orden.",
    };
  }
}