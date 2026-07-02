"use server";

import { revalidatePath } from "next/cache";
import {
  createCustomerAddressFromForm,
  saveCustomerProfile,
} from "@/lib/catalog/services/customer-service";

export async function saveCatalogCustomerProfile(
  formData: FormData
) {
  await saveCustomerProfile(formData);

  revalidatePath("/catalogo/cuenta");
}

export async function createCatalogCustomerAddress(
  formData: FormData
) {
  await createCustomerAddressFromForm(
    formData
  );

  revalidatePath("/catalogo/cuenta");
}
