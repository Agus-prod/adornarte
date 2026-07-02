"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registerCheckoutPayment } from "@/lib/catalog/services/payment-service";

export async function registerPayment(
  formData: FormData
) {
  await registerCheckoutPayment(
    formData
  );

  revalidatePath("/catalogo/checkout/pago");
  redirect("/catalogo/checkout/confirmacion");
}
