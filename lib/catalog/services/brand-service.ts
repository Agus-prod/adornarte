import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  createCatalogBrand,
  deleteCatalogBrand,
  getActiveCatalogBrands,
  getCatalogBrandById,
  getCatalogBrands,
  getCatalogProductsByBrand,
  updateCatalogBrand,
} from "@/lib/catalog/repositories/brand-repository";

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

function buildBrandValues(
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
    logo_url: readOptionalText(
      formData,
      "logo_url"
    ),
    banner_url: readOptionalText(
      formData,
      "banner_url"
    ),
    meta_title: readOptionalText(
      formData,
      "meta_title"
    ),
    meta_description: readOptionalText(
      formData,
      "meta_description"
    ),
    sort_order: readNumber(
      formData,
      "sort_order"
    ),
    is_active:
      formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };
}

export async function listCatalogBrands() {
  const organizationId =
    await getOrganizationId();

  return getCatalogBrands(
    organizationId
  );
}

export async function listActiveCatalogBrands() {
  const organizationId =
    await getOrganizationId();

  return getActiveCatalogBrands(
    organizationId
  );
}

export async function listCatalogProductsByBrand(
  brandId: string
) {
  const organizationId =
    await getOrganizationId();

  await getCatalogBrandById(
    brandId,
    organizationId
  );

  return getCatalogProductsByBrand(
    brandId,
    organizationId
  );
}

export async function createCatalogBrandFromForm(
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values = buildBrandValues(
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

  const insertValues: TablesInsert<"brands"> =
    {
      ...values,
      organization_id: organizationId,
    };

  return createCatalogBrand(insertValues);
}

export async function updateCatalogBrandFromForm(
  brandId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values: TablesUpdate<"brands"> =
    buildBrandValues(formData);

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

  return updateCatalogBrand(
    brandId,
    organizationId,
    values
  );
}

export async function deleteCatalogBrandById(
  brandId: string
) {
  const organizationId =
    await getOrganizationId();

  await deleteCatalogBrand(
    brandId,
    organizationId
  );
}
