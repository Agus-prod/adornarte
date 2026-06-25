import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { calculateExpected } from "@/lib/cash/calculate-expected";
import { CashRepository } from "@/lib/repositories/cash.repository";

type CloseCashInput = {
  cashId: string;
  countedAmount: number;
  notes: string;
};

export async function closeCash({
  cashId,
  countedAmount,
  notes,
}: CloseCashInput) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const cash =
    await CashRepository.findById(
      cashId
    );

  const expectedAmount =
    await calculateExpected(
      cash.id
    );

  const difference =
    countedAmount -
    expectedAmount;

  await CashRepository.close(
    cash.id,
    {
      expected_amount:
        expectedAmount,

      counted_amount:
        countedAmount,

      difference,

      notes,

      is_closed: true,

      closed_by:
        profile.id,

      closed_at:
        new Date().toISOString(),
    }
  );

  revalidatePath("/caja");

  return {
    expectedAmount,
    difference,
  };
}