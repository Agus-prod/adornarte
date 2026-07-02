"use server";

import { revalidatePath } from "next/cache";
import {
  addProductToCollectionFromForm,
  createCollectionFromForm,
  deleteCollectionById,
  removeProductFromCollection,
  updateCollectionFromForm,
  updateCollectionProductOrderFromForm,
} from "@/lib/catalog/services/collection-service";

const collectionsPath =
  "/catalogo/colecciones";

export async function createCollectionAction(
  formData: FormData
) {
  await createCollectionFromForm(
    formData
  );

  revalidatePath(collectionsPath);
}

export async function updateCollectionAction(
  collectionId: string,
  formData: FormData
) {
  await updateCollectionFromForm(
    collectionId,
    formData
  );

  revalidatePath(collectionsPath);
}

export async function deleteCollectionAction(
  collectionId: string
) {
  await deleteCollectionById(
    collectionId
  );

  revalidatePath(collectionsPath);
}

export async function addCollectionProductAction(
  collectionId: string,
  formData: FormData
) {
  await addProductToCollectionFromForm(
    collectionId,
    formData
  );

  revalidatePath(collectionsPath);
}

export async function updateCollectionProductOrderAction(
  collectionProductId: string,
  formData: FormData
) {
  await updateCollectionProductOrderFromForm(
    collectionProductId,
    formData
  );

  revalidatePath(collectionsPath);
}

export async function removeCollectionProductAction(
  collectionProductId: string
) {
  await removeProductFromCollection(
    collectionProductId
  );

  revalidatePath(collectionsPath);
}
