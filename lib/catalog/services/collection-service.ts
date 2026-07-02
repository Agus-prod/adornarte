import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  addCollectionProduct,
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollectionProducts,
  getCollections,
  getFeaturedCollections,
  removeCollectionProduct,
  updateCollection,
  updateCollectionProduct,
} from "@/lib/catalog/repositories/collection-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";

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
  const value = Number(
    readText(
      formData,
      key
    )
  );

  return Number.isFinite(value)
    ? value
    : 0;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function buildCollectionValues(
  formData: FormData
) {
  const name = readText(
    formData,
    "name"
  );
  const slug =
    slugify(
      readText(
        formData,
        "slug"
      )
    ) || slugify(name);

  return {
    name,
    slug,
    description: readOptionalText(
      formData,
      "description"
    ),
    banner_url: readOptionalText(
      formData,
      "banner_url"
    ),
    is_featured:
      formData.get("is_featured") === "on",
    is_active:
      formData.get("is_active") === "on",
    sort_order: readNumber(
      formData,
      "sort_order"
    ),
    meta_title: readOptionalText(
      formData,
      "meta_title"
    ),
    meta_description: readOptionalText(
      formData,
      "meta_description"
    ),
    updated_at: new Date().toISOString(),
  };
}

export async function listCollections() {
  const organizationId =
    await getOrganizationId();

  return getCollections(
    organizationId
  );
}

export async function listFeaturedCollections() {
  const organizationId =
    await getOrganizationId();

  return getFeaturedCollections(
    organizationId
  );
}

export async function createCollectionFromForm(
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values = buildCollectionValues(
    formData
  );

  if (!values.name) {
    throw new Error(
      "Nombre requerido."
    );
  }

  if (!values.slug) {
    throw new Error(
      "Slug requerido."
    );
  }

  const insertValues: TablesInsert<"collections"> =
    {
      ...values,
      organization_id: organizationId,
    };

  return createCollection(insertValues);
}

export async function updateCollectionFromForm(
  collectionId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values: TablesUpdate<"collections"> =
    buildCollectionValues(formData);

  if (!values.name) {
    throw new Error(
      "Nombre requerido."
    );
  }

  if (!values.slug) {
    throw new Error(
      "Slug requerido."
    );
  }

  return updateCollection(
    collectionId,
    organizationId,
    values
  );
}

export async function deleteCollectionById(
  collectionId: string
) {
  const organizationId =
    await getOrganizationId();

  await deleteCollection(
    collectionId,
    organizationId
  );
}

export async function listCollectionProducts(
  collectionId: string
) {
  const organizationId =
    await getOrganizationId();

  await getCollectionById(
    collectionId,
    organizationId
  );

  return getCollectionProducts(
    collectionId,
    organizationId
  );
}

export async function addProductToCollectionFromForm(
  collectionId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const productId = readText(
    formData,
    "product_id"
  );

  await getCollectionById(
    collectionId,
    organizationId
  );

  await getCatalogProductById(
    productId,
    organizationId
  );

  const values: TablesInsert<"collection_products"> =
    {
      organization_id: organizationId,
      collection_id: collectionId,
      product_id: productId,
      sort_order: readNumber(
        formData,
        "sort_order"
      ),
    };

  return addCollectionProduct(values);
}

export async function updateCollectionProductOrderFromForm(
  collectionProductId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values: TablesUpdate<"collection_products"> =
    {
      sort_order: readNumber(
        formData,
        "sort_order"
      ),
    };

  return updateCollectionProduct(
    collectionProductId,
    organizationId,
    values
  );
}

export async function removeProductFromCollection(
  collectionProductId: string
) {
  const organizationId =
    await getOrganizationId();

  await removeCollectionProduct(
    collectionProductId,
    organizationId
  );
}
