"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { registerCustomerPayment } from "@/lib/customers/register-customer-payment";

export async function createCustomer(
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

  const { error } =
    await supabase
      .from("customers")
      .insert({
        organization_id:
          profile.organization_id,

        name:
          formData
            .get("name")
            ?.toString() ?? "",

        phone:
          formData
            .get("phone")
            ?.toString() ?? "",

        email:
          formData
            .get("email")
            ?.toString() ?? "",

        credit_enabled:
          formData.get(
            "credit_enabled"
          ) === "on",

        credit_limit:
          Number(
            formData.get(
              "credit_limit"
            ) ?? 0
          ),
      });

  if (error) {
    throw error;
  }

  revalidatePath("/clientes");

  redirect("/clientes");
}
export async function updateCustomer(
  id: string,
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

  const { error } =
    await supabase
      .from("customers")
      .update({
        name:
          formData
            .get("name")
            ?.toString() ?? "",

        phone:
          formData
            .get("phone")
            ?.toString() ?? "",

        email:
          formData
            .get("email")
            ?.toString() ?? "",

        credit_enabled:
          formData.get(
            "credit_enabled"
          ) === "on",

        credit_limit:
          Number(
            formData.get(
              "credit_limit"
            ) ?? 0
          ),
      })
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    throw error;
  }

  revalidatePath("/clientes");

  redirect("/clientes");
}
export async function deleteCustomer(
  id: string
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

  const [
    salesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("sales")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("customer_id", id)
      .eq(
        "organization_id",
        profile.organization_id
      ),

    supabase
      .from("customer_payments")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("customer_id", id)
      .eq(
        "organization_id",
        profile.organization_id
      ),
  ]);

  if (salesResult.error) {
    throw salesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const hasHistory =
    (salesResult.count ?? 0) > 0 ||
    (paymentsResult.count ?? 0) > 0;

  if (hasHistory) {
    const { error } =
      await supabase
        .from("customers")
        .update({
          is_active: false,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq(
          "organization_id",
          profile.organization_id
        );

    if (error) {
      if (
        error.message.includes("is_active")
      ) {
        redirect(
          "/clientes?error=customer_has_history"
        );
      }

      throw error;
    }

    revalidatePath("/clientes");

    redirect("/clientes");
  }

  const { error } =
    await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    if (error.code !== "23503") {
      throw error;
    }

    const { error: archiveError } =
      await supabase
        .from("customers")
        .update({
          is_active: false,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq(
          "organization_id",
          profile.organization_id
        );

    if (archiveError) {
      if (
        archiveError.message.includes(
          "is_active"
        )
      ) {
        redirect(
          "/clientes?error=customer_has_history"
        );
      }

      throw archiveError;
    }
  }

  revalidatePath("/clientes");

  redirect("/clientes");
}

export async function deleteCustomerFromForm(
  formData: FormData
) {
  const id =
    formData.get("customer_id")?.toString() ??
    "";

  if (!id) {
    throw new Error("Cliente inválido");
  }

  await deleteCustomer(id);
}

export async function registerCustomerPaymentAction(
  customerId: string,
  formData: FormData
) {
  await registerCustomerPayment({
    customerId,
    saleId:
      formData
        .get("sale_id")
        ?.toString() ?? "",
    amount: Number(
      formData.get("amount") ?? 0
    ),
    paymentMethod:
      formData
        .get("payment_method")
        ?.toString() ?? "CASH",
    notes:
      formData.get("notes")?.toString() ||
      null,
  });

  revalidatePath(`/clientes/${customerId}`);
  revalidatePath("/clientes");
}
