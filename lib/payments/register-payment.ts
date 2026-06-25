import { PaymentsRepository } from "@/lib/repositories/payments.repository";
import { registerCashMovement } from "@/lib/cash/register-movement";

import type {
  RegisterPaymentInput,
} from "./types";

export async function registerPayment(
  input: RegisterPaymentInput
) {
  const payment =
    await PaymentsRepository.create({
      organization_id:
        input.organizationId,

      sale_id:
        input.saleId,

      amount:
        input.amount,

      method:
        input.method,

      cash_closing_id:
        input.cashClosingId ?? null,

      customer_payment_id:
        input.customerPaymentId ?? null,

      reference:
        input.reference ?? null,

      created_by:
        input.createdBy,
    });

  if (
    input.method === "CASH" &&
    input.cashClosingId
  ) {
    await registerCashMovement({
      organizationId:
        input.organizationId,

      cashClosingId:
        input.cashClosingId,

      type: "SALE",

      amount:
        input.amount,

      createdBy:
        input.createdBy,

      referenceType: "SALE",

      referenceId:
        input.saleId,

      notes:
        "Pago de venta",
    });
  }

  return payment;
}