import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/database.types";

type Customer = Tables<"customers">;

type SyncCatalogCustomerInput = {
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
};

function normalizeText(
  value: string | null
) {
  const normalized =
    value?.trim() ?? "";

  return normalized || null;
}

export async function syncCatalogCustomerToErp({
  organizationId,
  name,
  email,
  phone,
}: SyncCatalogCustomerInput) {
  const cleanName =
    name.trim();
  const cleanEmail =
    normalizeText(email)?.toLowerCase() ??
    null;
  const cleanPhone =
    normalizeText(phone);

  if (!cleanName) {
    throw new Error(
      "Nombre de cliente requerido."
    );
  }

  const supabase = createAdminClient();
  const existingByEmail = cleanEmail
    ? await supabase
        .from("customers")
        .select("*")
        .eq(
          "organization_id",
          organizationId
        )
        .eq("email", cleanEmail)
        .maybeSingle()
    : null;

  if (existingByEmail?.error) {
    throw existingByEmail.error;
  }

  const existing =
    existingByEmail?.data ?? null;

  if (existing) {
    const { data, error } =
      await supabase
        .from("customers")
        .update({
          name: cleanName,
          email: cleanEmail,
          phone:
            cleanPhone ?? existing.phone,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", existing.id)
        .eq(
          "organization_id",
          organizationId
        )
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data satisfies Customer;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      organization_id: organizationId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data satisfies Customer;
}
