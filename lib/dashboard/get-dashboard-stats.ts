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
        id,
        name,
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

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const {
    data: salesToday,
  } = await supabase
    .from("sales")
    .select("total")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .gte(
      "created_at",
      startOfDay.toISOString()
    );

  const {
    data: salesMonth,
  } = await supabase
    .from("sales")
    .select("total")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .gte(
      "created_at",
      startOfMonth.toISOString()
    );

  const {
    data: totalSalesData,
  } = await supabase
    .from("sales")
    .select("id")
    .eq(
      "organization_id",
      profile.organization_id
    );

  const salesTodayAmount =
    salesToday?.reduce(
      (sum, sale) =>
        sum +
        Number(sale.total ?? 0),
      0
    ) ?? 0;

  const salesMonthAmount =
    salesMonth?.reduce(
      (sum, sale) =>
        sum +
        Number(sale.total ?? 0),
      0
    ) ?? 0;

  const totalSales =
    totalSalesData?.length ?? 0;

  return {
    totalProducts,
    lowStock,
    outOfStock,
    inventoryValue,
    salesTodayAmount,
    salesMonthAmount,
    totalSales,
  };
}