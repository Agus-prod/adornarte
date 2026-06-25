export type SaleItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "TRANSFER"
  | "CREDIT";

export type PaymentStatus =
  | "PAID"
  | "PARTIAL"
  | "PENDING";

export type CreateSaleInput = {
  items: SaleItemInput[];

  customerId?: string;

  paymentMethod: PaymentMethod;

  paidAmount?: number;

  reference?: string;
};

export type SaleBalance = {
  total: number;

  paid: number;

  pending: number;

  status: PaymentStatus;
};