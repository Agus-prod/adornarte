import { createInventorySyncEvent } from "@/lib/catalog/repositories/inventory-sync-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";

export type InventorySyncSource =
  | "erp"
  | "commerce"
  | "pos";

export async function syncCatalogInventory(
  organizationId: string,
  productId: string,
  stock: number,
  source: InventorySyncSource,
  variantId?: string | null
) {
  await getCatalogProductById(
    productId,
    organizationId
  );

  return createInventorySyncEvent({
    organization_id: organizationId,
    product_id: productId,
    variant_id: variantId ?? null,
    stock,
    source,
  });
}
