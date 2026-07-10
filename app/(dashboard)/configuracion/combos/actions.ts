"use server";

import { revalidatePath } from "next/cache";
import { createComboPromotionFromForm } from "@/lib/catalog/services/promotion-management-service";

export async function createComboPromotionAction(
  formData: FormData
) {
  await createComboPromotionFromForm(
    formData
  );

  revalidatePath(
    "/configuracion/combos"
  );
}
