"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";

export async function openCashRegister(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const openingAmount =
    Number(
      formData.get(
        "opening_amount"
      ) || 0
    );

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const {
    data: existing,
  } = await supabase
    .from("cash_closings")
    .select("id")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .gte(
      "created_at",
      startOfDay.toISOString()
    )
    .limit(1);

  if (
    existing &&
    existing.length > 0
  ) {
    throw new Error(
      "Ya existe una caja registrada hoy."
    );
  }

  const { error } =
    await supabase
      .from("cash_closings")
      .insert({
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

  if (error) {
    throw error;
  }

  revalidatePath("/caja");
}

export async function closeCashRegister(
  formData: FormData
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const cashId =
    formData
      .get("cash_id")
      ?.toString() ?? "";

  const expectedAmount =
    Number(
      formData.get(
        "expected_amount"
      ) || 0
    );

  const openingAmount =
    Number(
      formData.get(
        "opening_amount"
      ) || 0
    );

  const countedAmount =
    Number(
      formData.get(
        "counted_amount"
      ) || 0
    );

  const notes =
    formData
      .get("notes")
      ?.toString() ?? "";

  const difference =
    countedAmount -
    (
      openingAmount +
      expectedAmount
    );

  const { error } =
    await supabase
      .from("cash_closings")
      .update({
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
      })
      .eq("id", cashId);

  if (error) {
    throw error;
  }

  revalidatePath("/caja");
}