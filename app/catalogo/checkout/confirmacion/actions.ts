"use server";

import { redirect } from "next/navigation";
import { createOrderFromCurrentCart } from "@/lib/catalog/services/order-service";

export async function confirmCatalogOrder() {
  await createOrderFromCurrentCart();

  redirect("/catalogo?pedido=recibido");
}
