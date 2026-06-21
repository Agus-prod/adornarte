import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getProducts() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        *,
        categories (
          name
        ),
        brands (
          name
        )
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return data;
}