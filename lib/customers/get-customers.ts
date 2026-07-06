import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getCustomers() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const query = supabase
    .from("customers")
    .select("*")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .order("name");

  const { data, error } =
    await query.eq("is_active", true);

  if (
    error &&
    error.message.includes("is_active")
  ) {
    const fallback =
      await supabase
        .from("customers")
        .select("*")
        .eq(
          "organization_id",
          profile.organization_id
        )
        .order("name");

    if (fallback.error) {
      throw fallback.error;
    }

    return fallback.data;
  }

  if (error) {
    throw error;
  }

  return data;
}
