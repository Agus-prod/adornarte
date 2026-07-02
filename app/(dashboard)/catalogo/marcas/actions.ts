"use server";

import { revalidatePath } from "next/cache";
import {
  createCatalogBrandFromForm,
  deleteCatalogBrandById,
  updateCatalogBrandFromForm,
} from "@/lib/catalog/services/brand-service";

const brandsPath =
  "/catalogo/marcas";

export async function createCatalogBrandAction(
  formData: FormData
) {
  await createCatalogBrandFromForm(
    formData
  );

  revalidatePath(brandsPath);
}

export async function updateCatalogBrandAction(
  brandId: string,
  formData: FormData
) {
  await updateCatalogBrandFromForm(
    brandId,
    formData
  );

  revalidatePath(brandsPath);
}

export async function deleteCatalogBrandAction(
  brandId: string
) {
  await deleteCatalogBrandById(
    brandId
  );

  revalidatePath(brandsPath);
}
