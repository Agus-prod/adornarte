import {
  createWishlistItem,
  deleteWishlistItem,
  getWishlistItems,
} from "@/lib/catalog/repositories/wishlist-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";
import { getCurrentCustomerEmail } from "@/lib/catalog/services/customer-service";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import type { CatalogProductSummary } from "@/lib/catalog/types";

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

async function getCustomerEmail() {
  const email =
    await getCurrentCustomerEmail();

  if (!email) {
    throw new Error(
      "Cliente requerido."
    );
  }

  return email;
}

export async function addWishlistItemFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const customerEmail =
    await getCustomerEmail();
  const productId = readText(
    formData,
    "product_id"
  );

  await getCatalogProductById(
    productId,
    organizationId
  );

  await createWishlistItem({
    organization_id: organizationId,
    customer_email: customerEmail,
    product_id: productId,
  });
}

export async function removeWishlistItemFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const customerEmail =
    await getCustomerEmail();

  await deleteWishlistItem(
    organizationId,
    customerEmail,
    readText(formData, "product_id")
  );
}

export async function getWishlistProductSummaries() {
  const organizationId =
    getOrganizationId();
  const customerEmail =
    await getCustomerEmail();
  const items = await getWishlistItems(
    organizationId,
    customerEmail
  );
  const products =
    await Promise.all(
      items.map(async (item) => {
        const product =
          await getCatalogProductById(
            item.product_id,
            organizationId
          );

        return {
          id: product.id,
          name: product.name,
          slug: product.id,
          description:
            product.description,
          imageUrl: product.image_url,
          salePrice:
            product.offer_price ??
            product.sale_price,
          isFeatured:
            product.is_featured ?? false,
        } satisfies CatalogProductSummary;
      })
    );

  return products;
}
