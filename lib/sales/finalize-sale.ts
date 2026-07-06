import { validateSale } from "./validate-sale";
import { createSaleRecord } from "./create-sale";
import { createSaleItems } from "./create-sale-items";
import { updateStock } from "./update-stock";

import { registerPayment } from "@/lib/payments/register-payment";
import { getOpenCash } from "@/lib/cash/get-open-cash";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const receivedAmount =
    input.paidAmount;

  if (
    input.paymentMethod !== "CREDIT" &&
    (typeof receivedAmount !==
      "number" ||
      !Number.isFinite(
        receivedAmount
      ) ||
      receivedAmount < total)
  ) {
    throw new Error(
      "El monto recibido debe ser igual o mayor al total."
    );
  }

  const paidAmount =
    input.paymentMethod === "CREDIT"
      ? 0
      : Math.min(
          total,
          input.paidAmount ?? total
        );

  const {
    sale,
    profile,
  } =
    await createSaleRecord(
      total,
      input.customerId,
      paidAmount,
      input.paymentMethod
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

  if (paidAmount > 0) {
    await registerPayment({
      organizationId:
        profile.organization_id,

      saleId:
        sale.id,

      amount:
        paidAmount,

      method:
        input.paymentMethod,

      createdBy:
        profile.id,

      cashClosingId:
        cash?.id ?? null,

      reference:
        input.reference,
    });
  }

  if (
    input.paymentMethod === "CREDIT" &&
    input.customerId
  ) {
    const supabase = createAdminClient();
    const {
      data: customer,
      error: customerError,
    } = await supabase
      .from("customers")
      .select("current_balance")
      .eq("id", input.customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

    if (customerError) {
      throw customerError;
    }

    const { error: balanceError } =
      await supabase
        .from("customers")
        .update({
          current_balance:
            Number(
              customer.current_balance ??
                0
            ) + total,
          last_purchase_at:
            new Date().toISOString(),
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", input.customerId)
        .eq(
          "organization_id",
          profile.organization_id
        );

    if (balanceError) {
      throw balanceError;
    }
  }

  return sale;
}
