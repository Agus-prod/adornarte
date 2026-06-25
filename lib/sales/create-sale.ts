import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { SalesRepository } from "@/lib/repositories/sales.repository";

export async function createSaleRecord(
  total: number,
  customerId?: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const sale =
    await SalesRepository.create({
      organization_id:
        profile.organization_id,

      customer_id:
        customerId ?? null,

      total,

      payment_status:
        "PENDING",
    });

  return {
    sale,
    profile,
  };
}