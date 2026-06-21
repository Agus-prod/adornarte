import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getProductById(
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

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

  if (error) {
    throw error;
  }

  return data;
}