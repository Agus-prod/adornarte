import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type ActiveSupplier = {
  id: string;
  name: string;
};

export async function getActiveSuppliers() {
  const profile = await getCurrentProfile();

  if (!profile) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("organization_id", profile.organization_id)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as ActiveSupplier[];
}