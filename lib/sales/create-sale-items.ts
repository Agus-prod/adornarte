import { SaleItemsRepository } from "@/lib/repositories/sale-items.repository";
import type { SaleItemInput } from "./types";

export async function createSaleItems(
  saleId: string,
  items: SaleItemInput[]
) {
  await SaleItemsRepository.createMany(
    items.map((item) => ({
      sale_id: saleId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))
  );
}