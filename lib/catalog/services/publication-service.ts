import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type {
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  getCatalogProductById,
  updateCatalogProductFeatured,
} from "@/lib/catalog/repositories/product-repository";
import {
  createPublication,
  getPublication,
  updatePublication,
} from "@/lib/catalog/repositories/publication-repository";

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

function readOptionalDate(
  formData: FormData,
  key: string
) {
  const value = readText(
    formData,
    key
  );

  return value
    ? new Date(value).toISOString()
    : null;
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

function buildPublicationValues(
  formData: FormData
) {
  const status =
    readText(
      formData,
      "status"
    ) || "draft";
  const publishedAt =
    readOptionalDate(
      formData,
      "published_at"
    );
  const now = new Date().toISOString();
  const normalizedPublishedAt =
    status === "scheduled"
      ? publishedAt
      : status === "published"
        ? now
        : null;

  return {
    slug: slugify(
      readText(
        formData,
        "slug"
      )
    ),
    status,
    is_visible:
      formData.get("is_visible") === "on",
    is_featured:
      formData.get("is_featured") === "on",
    meta_title: readOptionalText(
      formData,
      "meta_title"
    ),
    meta_description: readOptionalText(
      formData,
      "meta_description"
    ),
    canonical_url: readOptionalText(
      formData,
      "canonical_url"
    ),
    open_graph_title: readOptionalText(
      formData,
      "open_graph_title"
    ),
    open_graph_description: readOptionalText(
      formData,
      "open_graph_description"
    ),
    open_graph_image_url: readOptionalText(
      formData,
      "open_graph_image_url"
    ),
    published_at: normalizedPublishedAt,
    expires_at:
      status === "draft"
        ? null
        : readOptionalDate(
            formData,
            "expires_at"
          ),
    updated_at: new Date().toISOString(),
  };
}

export async function getProductPublicationForEditor(
  productId: string
) {
  const organizationId =
    await getOrganizationId();

  const product =
    await getCatalogProductById(
      productId,
      organizationId
    );

  const publication =
    await getPublication(
      productId,
      organizationId
    );

  if (publication) {
    return publication;
  }

  const values: TablesInsert<"product_publications"> = {
    organization_id: organizationId,
    product_id: productId,
    slug: slugify(product.name) || productId,
    status: "draft",
    is_visible: false,
    is_featured: product.is_featured ?? false,
    meta_title: product.name,
    meta_description: product.description,
  };

  return createPublication(values);
}

export async function updateProductPublicationForEditor(
  productId: string,
  formData: FormData
) {
  const organizationId =
    await getOrganizationId();

  await getCatalogProductById(
    productId,
    organizationId
  );

  const publication =
    await getProductPublicationForEditor(
      productId
    );

  const values: TablesUpdate<"product_publications"> =
    buildPublicationValues(formData);

  if (!values.slug) {
    throw new Error(
      "Slug requerido."
    );
  }

  if (
    values.status === "scheduled" &&
    !values.published_at
  ) {
    throw new Error(
      "Fecha de publicacion requerida."
    );
  }

  const updated =
    await updatePublication(
      publication.id,
      values
    );

  await updateCatalogProductFeatured(
    productId,
    organizationId,
    updated.is_featured
  );
}
