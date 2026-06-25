import { CashRepository } from "@/lib/repositories/cash.repository";

export type CashMovementType =
  | "OPENING"
  | "SALE"
  | "WITHDRAWAL"
  | "EXPENSE"
  | "INCOME"
  | "ADJUSTMENT";

type RegisterCashMovementInput = {
  organizationId: string;
  cashClosingId: string;
  type: CashMovementType;
  amount: number;
  createdBy: string;
  referenceType?: string | null;
  referenceId?: string | null;
  notes?: string | null;
};

export async function registerCashMovement(
  input: RegisterCashMovementInput
) {
  return CashRepository.createMovement({
    organization_id:
      input.organizationId,

    cash_closing_id:
      input.cashClosingId,

    type:
      input.type,

    amount:
      input.amount,

    reference_type:
      input.referenceType ?? null,

    reference_id:
      input.referenceId ?? null,

    notes:
      input.notes ?? null,

    created_by:
      input.createdBy,
  });
}