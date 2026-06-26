import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type Supplier = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getSuppliers() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select(`
      id,
      name,
      contact_name,
      phone,
      email,
      is_active,
      created_at
    `)
    .eq("organization_id", profile.organization_id)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Supplier[];
}