"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateCheckoutFromForm } from "@/lib/catalog/services/cart-service";
import { createCustomerAccount } from "@/lib/catalog/services/customer-service";
import { createOrderFromCurrentCart } from "@/lib/catalog/services/order-service";
import { registerCheckoutPayment } from "@/lib/catalog/services/payment-service";

export async function saveCheckout(
  formData: FormData
) {
  if (
    formData.get("create_account") ===
    "on"
  ) {
    await createCustomerAccount(formData);
  }

  await updateCheckoutFromForm(
    formData
  );
  await registerCheckoutPayment(
    formData
  );
  await createOrderFromCurrentCart();

  revalidatePath("/catalogo/checkout");
  revalidatePath("/catalogo/carrito");
  revalidatePath("/clientes");
  revalidatePath("/ventas");
  redirect("/catalogo?pedido=recibido");
}
