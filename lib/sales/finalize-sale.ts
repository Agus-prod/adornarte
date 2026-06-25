import { validateSale } from "./validate-sale";
import { createSaleRecord } from "./create-sale";
import { createSaleItems } from "./create-sale-items";
import { updateStock } from "./update-stock";

import { registerPayment } from "@/lib/payments/register-payment";
import { getOpenCash } from "@/lib/cash/get-open-cash";

import type {
  CreateSaleInput,
} from "./types";

export async function finalizeSale(
  input: CreateSaleInput
) {
  await validateSale(input);

  const total =
    input.items.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const {
    sale,
    profile,
  } =
    await createSaleRecord(
      total,
      input.customerId
    );

  await createSaleItems(
    sale.id,
    input.items
  );

  await updateStock(
    input.items
  );

  const cash =
    await getOpenCash();

  await registerPayment({
    organizationId:
      profile.organization_id,

    saleId:
      sale.id,

    amount:
      total,

    method:
      input.paymentMethod,

    createdBy:
      profile.id,

    cashClosingId:
      cash?.id ?? null,

    reference:
      input.reference,
  });

  return sale;
}