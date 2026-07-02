import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  createVariant,
  deleteVariant,
  getVariant,
  getVariants,
  setDefaultVariant,
  updateVariant,
} from "@/lib/catalog/repositories/variant-repository";

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

function buildVariantValues(
  formData: FormData
) {
  return {
    name: readText(
      formData,
      "name"
    ),
    sku: readOptionalText(
      formData,
      "sku"
    ),
    barcode: readOptionalText(
      formData,
      "barcode"
    ),
    cost_price: readNumber(
      formData,
      "cost_price"
    ),
    sale_price: readNumber(
      formData,
      "sale_price"
    ),
    stock: readNumber(
      formData,
      "stock"
    ),
    active:
      formData.get("active") === "on",
  };
}

export async function getProductVariantsForEditor(
  productId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  return getVariants(
    productId,
    organizationId
  );
}

export async function createProductVariant(
  productId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const variants =
    await getVariants(
      productId,
      organizationId
    );

  const shouldBeDefault =
    variants.length === 0 ||
    formData.get("is_default") === "on";

  const values: TablesInsert<"product_variants"> = {
    ...buildVariantValues(formData),
    product_id: productId,
    organization_id: organizationId,
    is_default: false,
  };

  const variant =
    await createVariant(values);

  if (shouldBeDefault) {
    await setDefaultVariant(
      productId,
      variant.id
    );
  }
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const variant =
    await getVariant(
      variantId,
      organizationId
    );

  if (variant.product_id !== productId) {
    throw new Error(
      "Variante no pertenece al producto."
    );
  }

  const values: TablesUpdate<"product_variants"> =
    buildVariantValues(formData);

  await updateVariant(
    variantId,
    values
  );

  if (formData.get("is_default") === "on") {
    await setDefaultVariant(
      productId,
      variantId
    );
  }
}

export async function deleteProductVariant(
  productId: string,
  variantId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const variant =
    await getVariant(
      variantId,
      organizationId
    );

  if (variant.product_id !== productId) {
    throw new Error(
      "Variante no pertenece al producto."
    );
  }

  await deleteVariant(variantId);
}

export async function setDefaultProductVariant(
  productId: string,
  variantId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const variant =
    await getVariant(
      variantId,
      organizationId
    );

  if (variant.product_id !== productId) {
    throw new Error(
      "Variante no pertenece al producto."
    );
  }

  await setDefaultVariant(
    productId,
    variantId
  );
}
