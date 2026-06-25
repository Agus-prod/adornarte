export const PAYMENT_METHODS = [
  "CASH",
  "CARD",
  "TRANSFER",
  "CREDIT",
] as const;

export const PAYMENT_STATUS = [
  "PAID",
  "PARTIAL",
  "PENDING",
] as const;

export const CASH_MOVEMENT_TYPES = [
  "OPENING",
  "SALE",
  "CUSTOMER_PAYMENT",
  "PURCHASE_PAYMENT",
  "WITHDRAWAL",
  "EXPENSE",
  "INCOME",
  "ADJUSTMENT",
] as const;