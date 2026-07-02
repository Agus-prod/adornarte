"use server";

import { revalidatePath } from "next/cache";
import {
  createCatalogCategoryFromForm,
  deleteCatalogCategoryById,
  updateCatalogCategoryFromForm,
} from "@/lib/catalog/services/category-service";

const categoriesPath =
  "/catalogo/categorias";

export async function createCatalogCategoryAction(
  formData: FormData
) {
  await createCatalogCategoryFromForm(
    formData
  );

  revalidatePath(categoriesPath);
}

export async function updateCatalogCategoryAction(
  categoryId: string,
  formData: FormData
) {
  await updateCatalogCategoryFromForm(
    categoryId,
    formData
  );

  revalidatePath(categoriesPath);
}

export async function deleteCatalogCategoryAction(
  categoryId: string
) {
  await deleteCatalogCategoryById(
    categoryId
  );

  revalidatePath(categoriesPath);
}
