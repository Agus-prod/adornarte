import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  clearPrimaryImages,
  createImage,
  deleteImage,
  getImage,
  getImages,
  getProductImagePublicUrl,
  removeProductImageFile,
  updateImage,
  updateProductPrimaryImage,
  uploadProductImage,
} from "@/lib/catalog/repositories/image-repository";
import type { TablesUpdate } from "@/lib/database.types";

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function readOptionalText(
  formData: FormData,
  key: string
) {
  const value = readText(
    formData,
    key
  );

  return value || null;
}

function readNumber(
  formData: FormData,
  key: string
) {
  return Number(
    formData.get(key) || 0
  );
}

function getExtension(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!extension) {
    return "jpg";
  }

  return extension;
}

async function getOrganizationId() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  return profile.organization_id;
}

async function ensureProductAccess(
  productId: string,
  organizationId: string
) {
  await getCatalogProductById(
    productId,
    organizationId
  );
}

function getFormFile(
  formData: FormData
) {
  const file = formData.get("image");

  if (!(file instanceof File)) {
    throw new Error(
      "Imagen requerida."
    );
  }

  if (file.size === 0) {
    throw new Error(
      "Imagen requerida."
    );
  }

  if (!allowedImageTypes.includes(file.type)) {
    throw new Error(
      "Formato de imagen no permitido."
    );
  }

  return file;
}

export async function getProductImagesForEditor(
  productId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  return getImages(
    productId,
    organizationId
  );
}

export async function uploadProductImageForEditor(
  productId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const file = getFormFile(formData);
  const images =
    await getImages(
      productId,
      organizationId
    );

  const path = `${organizationId}/${productId}/${crypto.randomUUID()}.${getExtension(file)}`;

  await uploadProductImage(
    path,
    file
  );

  const url =
    await getProductImagePublicUrl(path);

  const shouldBePrimary =
    images.length === 0 ||
    formData.get("is_primary") === "on";

  if (shouldBePrimary) {
    await clearPrimaryImages(
      productId,
      organizationId
    );
  }

  await createImage({
    organization_id: organizationId,
    product_id: productId,
    url,
    path,
    alt_text: readOptionalText(
      formData,
      "alt_text"
    ),
    sort_order: readNumber(
      formData,
      "sort_order"
    ),
    is_primary: shouldBePrimary,
  });

  if (shouldBePrimary) {
    await updateProductPrimaryImage(
      productId,
      organizationId,
      url
    );
  }
}

export async function updateProductImageForEditor(
  productId: string,
  imageId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const image =
    await getImage(
      imageId,
      organizationId
    );

  if (image.product_id !== productId) {
    throw new Error(
      "Imagen no pertenece al producto."
    );
  }

  const isPrimary =
    formData.get("is_primary") === "on";

  if (isPrimary) {
    await clearPrimaryImages(
      productId,
      organizationId
    );
  }

  const values: TablesUpdate<"product_images"> = {
    alt_text: readOptionalText(
      formData,
      "alt_text"
    ),
    sort_order: readNumber(
      formData,
      "sort_order"
    ),
    is_primary: isPrimary,
  };

  await updateImage(
    imageId,
    values
  );

  if (isPrimary) {
    await updateProductPrimaryImage(
      productId,
      organizationId,
      image.url
    );
  }
}

export async function deleteProductImageForEditor(
  productId: string,
  imageId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const image =
    await getImage(
      imageId,
      organizationId
    );

  if (image.product_id !== productId) {
    throw new Error(
      "Imagen no pertenece al producto."
    );
  }

  await deleteImage(imageId);
  await removeProductImageFile(
    image.path
  );

  if (image.is_primary) {
    const images =
      await getImages(
        productId,
        organizationId
      );

    const nextPrimary =
      images[0] ?? null;

    if (nextPrimary) {
      await clearPrimaryImages(
        productId,
        organizationId
      );

      await updateImage(
        nextPrimary.id,
        {
          is_primary: true,
        }
      );

      await updateProductPrimaryImage(
        productId,
        organizationId,
        nextPrimary.url
      );
    } else {
      await updateProductPrimaryImage(
        productId,
        organizationId,
        null
      );
    }
  }
}

export async function setPrimaryProductImageForEditor(
  productId: string,
  imageId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const image =
    await getImage(
      imageId,
      organizationId
    );

  if (image.product_id !== productId) {
    throw new Error(
      "Imagen no pertenece al producto."
    );
  }

  await clearPrimaryImages(
    productId,
    organizationId
  );

  await updateImage(
    imageId,
    {
      is_primary: true,
    }
  );

  await updateProductPrimaryImage(
    productId,
    organizationId,
    image.url
  );
}
