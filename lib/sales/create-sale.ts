import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { SalesRepository } from "@/lib/repositories/sales.repository";

export async function createSaleRecord(
  total: number,
  customerId?: string,
  paidAmount = total,
  paymentMethod = "CASH"
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

      paid_amount: paidAmount,

      pending_amount:
        total - paidAmount,

      payment_method:
        paymentMethod,

      payment_status:
        paidAmount >= total
          ? "PAID"
          : paidAmount > 0
            ? "PARTIAL"
            : "PENDING",
    });

  return {
    sale,
    profile,
  };
}
