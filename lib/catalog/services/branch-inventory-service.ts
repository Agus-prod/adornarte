import {
  getProductBranchInventory,
  upsertBranchInventory,
} from "@/lib/catalog/repositories/branch-inventory-repository";

export async function getCatalogBranchAvailability(
  productId: string,
  organizationId: string
) {
  const inventory =
    await getProductBranchInventory(
      productId,
      organizationId
    );

  return inventory.map((item) => ({
    ...item,
    available:
      item.available_stock -
      item.reserved_stock,
  }));
}

export async function syncCatalogBranchInventory(
  organizationId: string,
  branchId: string,
  productId: string,
  availableStock: number,
  variantId?: string | null
) {
  return upsertBranchInventory({
    organization_id: organizationId,
    branch_id: branchId,
    product_id: productId,
    variant_id: variantId ?? null,
    available_stock: availableStock,
    reserved_stock: 0,
    updated_at: new Date().toISOString(),
  });
}
