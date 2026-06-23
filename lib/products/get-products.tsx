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
      .eq(
        "is_active",
        true
      );

  if (error) {
    throw error;
  }

 return (data ?? []).sort(
  (a, b) => {
      const aFeatured =
        a.is_featured
          ? 1
          : 0;

      const bFeatured =
        b.is_featured
          ? 1
          : 0;

      if (
        aFeatured !== bFeatured
      ) {
        return (
          bFeatured -
          aFeatured
        );
      }

      const aStock =
        (a.stock ?? 0) > 0
          ? 1
          : 0;

      const bStock =
        (b.stock ?? 0) > 0
          ? 1
          : 0;

      if (
        aStock !== bStock
      ) {
        return (
          bStock - aStock
        );
      }

      return a.name.localeCompare(
        b.name
      );
    }
  );
}