import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getCategories() {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error("Usuario no autenticado");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}