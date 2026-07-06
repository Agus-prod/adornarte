"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { saveCatalogSettingsFromForm } from "@/lib/catalog/services/settings-service";

const settingsPath =
  "/configuracion/commerce";

export async function saveCommerceSettings(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  await saveCatalogSettingsFromForm(
    profile.organization_id,
    formData
  );

  revalidatePath(settingsPath);
  revalidatePath("/catalogo");
  revalidatePath("/catalogo/checkout/pago");
}
