import { PaymentsRepository } from "@/lib/repositories/payments.repository";
import { SalesRepository } from "@/lib/repositories/sales.repository";

export async function getSaleBalance(
  saleId: string
) {
  const sale =
    await SalesRepository.findById(
      saleId
    );

  if (!sale) {
    throw new Error(
      "Venta no encontrada."
    );
  }

  const payments =
    await PaymentsRepository.findBySale(
      saleId
    );

  const paid = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount),
    0
  );

  const total =
    Number(sale.total);

  const pending =
    Math.max(total - paid, 0);

  return {
    total,
    paid,
    pending,
    status:
      pending === 0
        ? "PAID"
        : paid === 0
        ? "PENDING"
        : "PARTIAL",
  };
}