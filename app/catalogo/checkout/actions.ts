"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateCheckoutFromForm } from "@/lib/catalog/services/cart-service";

export async function saveCheckout(
  formData: FormData
) {
  await updateCheckoutFromForm(
    formData
  );

  revalidatePath("/catalogo/checkout");
  redirect("/catalogo/checkout/pago");
}
