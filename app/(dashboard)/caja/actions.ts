"use server";

import { openCash } from "@/lib/cash/open-cash";
import { closeCash } from "@/lib/cash/close-cash";

export async function openCashRegister(
  formData: FormData
) {
  const openingAmount =
    Number(
      formData.get(
        "opening_amount"
      )
    );

  await openCash(
    openingAmount
  );
}

export async function closeCashRegister(
  formData: FormData
) {
  await closeCash({
    cashId:
      formData
        .get("cash_id")
        ?.toString() ?? "",

    countedAmount:
      Number(
        formData.get(
          "counted_amount"
        )
      ),

    notes:
      formData
        .get("notes")
        ?.toString() ?? "",
  });
}