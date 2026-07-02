import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  getCatalogProductById,
} from "@/lib/catalog/repositories/product-repository";
import {
  createAttribute,
  deleteAttribute,
  getAttribute,
  getAttributes,
  updateAttribute,
} from "@/lib/catalog/repositories/attribute-repository";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
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

function buildAttributeValues(
  formData: FormData
) {
  return {
    name: readText(
      formData,
      "name"
    ),
    value: readText(
      formData,
      "value"
    ),
    type: readText(
      formData,
      "type"
    ) || "custom",
    sort_order: readNumber(
      formData,
      "sort_order"
    ),
  };
}

export async function getProductAttributesForEditor(
  productId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  return getAttributes(
    productId,
    organizationId
  );
}

export async function createProductAttribute(
  productId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const values: TablesInsert<"product_attributes"> = {
    ...buildAttributeValues(formData),
    organization_id: organizationId,
    product_id: productId,
  };

  await createAttribute(values);
}

export async function updateProductAttribute(
  productId: string,
  attributeId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const attribute =
    await getAttribute(
      attributeId,
      organizationId
    );

  if (attribute.product_id !== productId) {
    throw new Error(
      "Atributo no pertenece al producto."
    );
  }

  const values: TablesUpdate<"product_attributes"> =
    buildAttributeValues(formData);

  await updateAttribute(
    attributeId,
    values
  );
}

export async function deleteProductAttribute(
  productId: string,
  attributeId: string
) {
  const organizationId =
    await getOrganizationId();

  await ensureProductAccess(
    productId,
    organizationId
  );

  const attribute =
    await getAttribute(
      attributeId,
      organizationId
    );

  if (attribute.product_id !== productId) {
    throw new Error(
      "Atributo no pertenece al producto."
    );
  }

  await deleteAttribute(attributeId);
}
