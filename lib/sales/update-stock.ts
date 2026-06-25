import { ProductsRepository } from "@/lib/repositories/products.repository";
import { BusinessError } from "@/lib/core";
import type { SaleItemInput } from "./types";

export async function updateStock(
  items: SaleItemInput[]
) {
  for (const item of items) {
    const product =
      await ProductsRepository.findById(
        item.productId
      );

    if (!product) {
      throw new BusinessError(
        "PRODUCT_NOT_FOUND",
        "Producto no encontrado."
      );
    }

    const currentStock =
      Number(product.stock ?? 0);

    const newStock =
      currentStock - item.quantity;

    if (newStock < 0) {
      throw new BusinessError(
        "INSUFFICIENT_STOCK",
        `Stock insuficiente para ${product.name}.`
      );
    }

    await ProductsRepository.updateStock(
      product.id,
      newStock
    );
  }
}