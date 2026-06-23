import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type LatestSale = {
  id: string;
  total: number;
  created_at: string;
  customers: {
    name: string;
  } | null;
};

export async function getLatestSales(): Promise<
  LatestSale[]
> {
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
      .from("sales")
      .select(`
        id,
        total,
        created_at,
        customers (
          name
        )
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  if (error) {
    throw error;
  }

  return (data ??
    []) as unknown as LatestSale[];
}