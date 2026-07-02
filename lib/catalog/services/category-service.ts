import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  createCatalogCategory,
  deleteCatalogCategory,
  getActiveCatalogCategories,
  getCatalogCategories,
  getCatalogCategoryById,
  getCatalogProductsByCategory,
  updateCatalogCategory,
  type CatalogCategory,
} from "@/lib/catalog/repositories/category-repository";

export type CatalogCategoryNode =
  CatalogCategory & {
    children: CatalogCategoryNode[];
  };

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

function buildCategoryTree(
  categories: CatalogCategory[]
): CatalogCategoryNode[] {
  const nodes = new Map<
    string,
    CatalogCategoryNode
  >();
  const roots: CatalogCategoryNode[] = [];

  categories.forEach((category) => {
    nodes.set(
      category.id,
      {
        ...category,
        children: [],
      }
    );
  });

  nodes.forEach((node) => {
    if (
      node.parent_id &&
      nodes.has(node.parent_id)
    ) {
      nodes
        .get(node.parent_id)
        ?.children.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
}

function buildCategoryValues(
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
    parent_id: readOptionalText(
      formData,
      "parent_id"
    ),
    image_url: readOptionalText(
      formData,
      "image_url"
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

export async function listCatalogCategories() {
  const organizationId =
    await getOrganizationId();

  return getCatalogCategories(
    organizationId
  );
}

export async function listCatalogCategoryTree() {
  const organizationId =
    await getOrganizationId();
  const categories =
    await getActiveCatalogCategories(
      organizationId
    );

  return buildCategoryTree(categories);
}

export async function listCatalogProductsByCategory(
  categoryId: string
) {
  const organizationId =
    await getOrganizationId();

  await getCatalogCategoryById(
    categoryId,
    organizationId
  );

  return getCatalogProductsByCategory(
    categoryId,
    organizationId
  );
}

export async function createCatalogCategoryFromForm(
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values = buildCategoryValues(
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

  const insertValues: TablesInsert<"categories"> =
    {
      ...values,
      organization_id: organizationId,
    };

  return createCatalogCategory(
    insertValues
  );
}

export async function updateCatalogCategoryFromForm(
  categoryId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();
  const values: TablesUpdate<"categories"> =
    buildCategoryValues(formData);

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

  if (values.parent_id === categoryId) {
    throw new Error(
      "La categoria no puede ser su propio padre."
    );
  }

  return updateCatalogCategory(
    categoryId,
    organizationId,
    values
  );
}

export async function deleteCatalogCategoryById(
  categoryId: string
) {
  const organizationId =
    await getOrganizationId();

  await deleteCatalogCategory(
    categoryId,
    organizationId
  );
}
