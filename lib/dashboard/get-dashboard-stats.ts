import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function getDashboardStats() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const { data: products, error } =
    await supabase
      .from("products")
      .select(`
        stock,
        min_stock,
        cost_price
      `)
      .eq(
        "organization_id",
        profile.organization_id
      );

  if (error) {
    throw error;
  }

  const totalProducts =
    products.length;

  const lowStock =
    products.filter(
      (p) =>
        (p.stock ?? 0) > 0 &&
        (p.stock ?? 0) <=
          (p.min_stock ?? 0)
    ).length;

  const outOfStock =
    products.filter(
      (p) =>
        (p.stock ?? 0) <= 0
    ).length;

  const inventoryValue =
    products.reduce(
      (total, product) =>
        total +
        (product.stock ?? 0) *
          Number(
            product.cost_price ?? 0
          ),
      0
    );

  return {
    totalProducts,
    lowStock,
    outOfStock,
    inventoryValue,
  };
}