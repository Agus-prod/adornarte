"use server";

import { createSale } from "@/lib/pos/create-sale";

type Item = {
  productId: string;
  quantity: number;
  price: number;
};

type PaymentMethod =
  | "CASH"
  | "CARD"
  | "TRANSFER"
  | "CREDIT";

export async function createSaleAction(
  items: Item[],
  customerId?: string,
  paymentMethod: PaymentMethod = "CASH",
  paidAmount?: number,
  reference?: string
) {
  return createSale(
    items,
    customerId,
    paymentMethod,
    paidAmount,
    reference
  );
}
