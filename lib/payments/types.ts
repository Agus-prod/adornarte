export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "TRANSFER"
  | "CREDIT";

export type PaymentStatus =
  | "PAID"
  | "PARTIAL"
  | "PENDING";

export type RegisterPaymentInput = {
  organizationId: string;
  saleId: string;
  amount: number;
  method: PaymentMethod;
  createdBy: string;
  cashClosingId?: string | null;
  customerPaymentId?: string | null;
  reference?: string | null;
};