import { finalizeSale } from "@/lib/sales/finalize-sale";

type SaleItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createSale(
  items: SaleItem[],
  customerId?: string,
  paymentMethod:
    | "CASH"
    | "CARD"
    | "TRANSFER"
    | "CREDIT" = "CASH",
  paidAmount?: number,
  reference?: string
) {
  return await finalizeSale({
    items,
    customerId,
    paymentMethod,
    paidAmount,
    reference,
  });
}
