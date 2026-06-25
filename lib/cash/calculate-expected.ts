import { CashRepository } from "@/lib/repositories/cash.repository";

export async function calculateExpected(
  cashClosingId: string
) {
  const movements =
    await CashRepository.getMovements(
      cashClosingId
    );

  let expected = 0;

  for (const movement of movements) {
    switch (movement.type) {
      case "OPENING":
      case "SALE":
      case "INCOME":
        expected += Number(
          movement.amount
        );
        break;

      case "WITHDRAWAL":
      case "EXPENSE":
        expected -= Number(
          movement.amount
        );
        break;

      case "ADJUSTMENT":
        expected += Number(
          movement.amount
        );
        break;
    }
  }

  return expected;
}