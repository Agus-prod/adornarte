import { createClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!profile) {
    return null;
  }

  if (!profile.organization_id) {
    throw new Error(
      "El usuario no tiene organización asignada"
    );
  }

  return {
    ...profile,
    organization_id:
      profile.organization_id,
  };
}