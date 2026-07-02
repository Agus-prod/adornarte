import {
  createReview,
  getApprovedReviews,
} from "@/lib/catalog/repositories/review-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function getOrganizationId() {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    throw new Error(
      "Catalogo no configurado."
    );
  }

  return organizationId;
}

export async function getProductReviews(
  productId: string
) {
  const organizationId =
    getOrganizationId();

  return getApprovedReviews(
    productId,
    organizationId
  );
}

export async function createProductReviewFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const productId = readText(
    formData,
    "product_id"
  );
  const rating = Number(
    readText(formData, "rating")
  );

  await getCatalogProductById(
    productId,
    organizationId
  );

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    throw new Error(
      "Calificacion no valida."
    );
  }

  await createReview({
    organization_id: organizationId,
    product_id: productId,
    customer_name: readText(
      formData,
      "customer_name"
    ),
    customer_email: readText(
      formData,
      "customer_email"
    ).toLowerCase(),
    rating,
    comment:
      readText(formData, "comment") ||
      null,
    photo_url:
      readText(formData, "photo_url") ||
      null,
    status: "pending",
  });
}
