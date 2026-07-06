"use server";

import { revalidatePath } from "next/cache";
import { createCouponFromForm } from "@/lib/catalog/services/coupon-management-service";

export async function createCouponAction(
  formData: FormData
) {
  await createCouponFromForm(formData);

  revalidatePath(
    "/configuracion/cupones"
  );
}
