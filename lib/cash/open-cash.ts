import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { registerCashMovement } from "@/lib/cash/register-movement";
import { CashRepository } from "@/lib/repositories/cash.repository";

export async function openCash(
  openingAmount: number
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const existing =
    await CashRepository.getOpenCash(
      profile.organization_id
    );

  if (existing) {
    throw new Error(
      "Ya existe una caja abierta."
    );
  }

  const cash =
    await CashRepository.create({
      organization_id:
        profile.organization_id,

      opening_amount:
        openingAmount,

      expected_amount: 0,

      counted_amount: 0,

      difference: 0,

      notes: "",

      is_closed: false,

      opened_by:
        profile.id,

      start_at:
        new Date().toISOString(),
    });

  await registerCashMovement({
    organizationId:
      profile.organization_id,

    cashClosingId:
      cash.id,

    type: "OPENING",

    amount:
      openingAmount,

    createdBy:
      profile.id,

    notes:
      "Apertura de caja",
  });

  revalidatePath("/caja");

  return cash;
}