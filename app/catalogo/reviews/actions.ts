"use server";

import { revalidatePath } from "next/cache";
import { createProductReviewFromForm } from "@/lib/catalog/services/review-service";

export async function createProductReview(
  slug: string,
  formData: FormData
) {
  await createProductReviewFromForm(
    formData
  );

  revalidatePath(
    `/catalogo/productos/${slug}`
  );
}
