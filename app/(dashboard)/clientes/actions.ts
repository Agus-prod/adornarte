"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

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
    throw error;
  }

  revalidatePath("/clientes");

  redirect("/clientes");
}