"use server";

import { revalidatePath } from "next/cache";
import { convertCatalogOrderToSale } from "@/lib/catalog/services/convert-order-service";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  getOrder,
  updateOrder,
} from "@/lib/catalog/repositories/order-repository";
import { updatePayment } from "@/lib/catalog/repositories/payment-repository";
import { createAdminClient } from "@/lib/supabase/admin";

export async function convertCatalogOrderToSaleAction(
  orderId: string
) {
  try {
    await convertCatalogOrderToSale(orderId);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "Este pedido ya fue convertido en venta."
    ) {
      revalidatePath("/ventas");
      return;
    }

    throw error;
  }

  revalidatePath("/ventas");
  revalidatePath("/inventario/productos");
}

export async function markCatalogOrderDeliveredAction(
  orderId: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const order = await getOrder(
    orderId,
    profile.organization_id
  );

  if (!order.sale_id) {
    throw new Error(
      "Primero convierte el pedido en venta."
    );
  }

  await updateOrder(
    order.id,
    profile.organization_id,
    {
      status: "delivered",
      updated_at: new Date().toISOString(),
    }
  );

  revalidatePath("/ventas");
  revalidatePath("/catalogo/cuenta");
}

export async function confirmCatalogTransferPaymentAction(
  paymentId: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const supabase =
    createAdminClient();

  const { data: payment, error } =
    await supabase
      .from("catalog_payments")
      .select("id, cart_id, order_id, status")
      .eq("id", paymentId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

  if (error) {
    throw error;
  }

  const timestamp =
    new Date().toISOString();

  if (payment.status !== "paid") {
    await updatePayment(
      payment.id,
      profile.organization_id,
      {
        status: "paid",
        paid_at: timestamp,
        updated_at: timestamp,
      }
    );
  }

  if (payment.order_id) {
    const { error: duplicateError } =
      await supabase
      .from("catalog_payments")
      .update({
        status: "paid",
        paid_at: timestamp,
        updated_at: timestamp,
      })
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("method", "transfer")
      .eq("status", "pending")
      .eq("order_id", payment.order_id);

    if (duplicateError) {
      throw duplicateError;
    }
  } else if (payment.cart_id) {
    const { error: duplicateError } =
      await supabase
        .from("catalog_payments")
        .update({
          status: "paid",
          paid_at: timestamp,
          updated_at: timestamp,
        })
        .eq(
          "organization_id",
          profile.organization_id
        )
        .eq("method", "transfer")
        .eq("status", "pending")
        .eq("cart_id", payment.cart_id);

    if (duplicateError) {
      throw duplicateError;
    }
  }

  if (payment.order_id) {
    const order = await getOrder(
      payment.order_id,
      profile.organization_id
    );

    if (order.status === "pending") {
      await updateOrder(
        order.id,
        profile.organization_id,
        {
          status: "paid",
          updated_at: timestamp,
        }
      );
    }

    const currentOrder =
      order.status === "pending"
        ? await getOrder(
            order.id,
            profile.organization_id
          )
        : order;

    if (!currentOrder.sale_id) {
      await convertCatalogOrderToSale(
        currentOrder.id
      );
    }
  }

  revalidatePath("/ventas");
  revalidatePath("/inventario/productos");
  revalidatePath("/catalogo/cuenta");
}
