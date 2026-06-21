"use server";

import { createSale } from "@/lib/pos/create-sale";

type Item = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createSaleAction(
  items: Item[]
) {
  return createSale(items);
}