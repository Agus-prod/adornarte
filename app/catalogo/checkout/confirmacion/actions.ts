"use server";

import { redirect } from "next/navigation";
import { createOrderFromCurrentCart } from "@/lib/catalog/services/order-service";

export async function confirmCatalogOrder() {
  const order =
    await createOrderFromCurrentCart();

  redirect(
    `/catalogo/pedidos/${order.id}`
  );
}
