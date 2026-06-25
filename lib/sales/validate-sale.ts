import { ProductsRepository } from "@/lib/repositories/products.repository";
import { BusinessError } from "@/lib/core";
import type { CreateSaleInput } from "./types";

export async function validateSale(
  input: CreateSaleInput
) {
  if (input.items.length === 0) {
    throw new BusinessError(
      "EMPTY_SALE",
      "La venta no contiene productos."
    );
  }

  for (const item of input.items) {
    if (item.quantity <= 0) {
      throw new BusinessError(
        "INVALID_QUANTITY",
        "Cantidad inválida."
      );
    }

    if (item.price < 0) {
      throw new BusinessError(
        "INVALID_PRICE",
        "Precio inválido."
      );
    }

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

    if (!product.is_active) {
      throw new BusinessError(
        "PRODUCT_INACTIVE",
        `${product.name} está inactivo.`
      );
    }

    if (
      Number(product.stock ?? 0) <
      item.quantity
    ) {
      throw new BusinessError(
        "INSUFFICIENT_STOCK",
        `Stock insuficiente para ${product.name}.`
      );
    }
  }

  return true;
}