import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type SaleItem = {
  quantity: number | null;
  price: number | null;

  products:
    | {
        cost_price: number | null;
      }
    | {
        cost_price: number | null;
      }[]
    | null;
};

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
      )
      .eq("is_active", true);

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

  const criticalProducts =
    products
      .filter(
        (p) =>
          (p.stock ?? 0) <=
          (p.min_stock ?? 0)
      )
      .sort((a, b) => {
        const aStock =
          a.stock ?? 0;

        const bStock =
          b.stock ?? 0;

        if (
          aStock === 0 &&
          bStock > 0
        ) {
          return -1;
        }

        if (
          bStock === 0 &&
          aStock > 0
        ) {
          return 1;
        }

        return aStock - bStock;
      })
      .slice(0, 5);

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

  const {
    count: totalCustomers,
  } = await supabase
    .from("customers")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "organization_id",
      profile.organization_id
    );

  const {
    data: saleItemsData,
  } = await supabase
    .from("sale_items")
    .select(`
      quantity,
      price,
      products (
        cost_price
      )
    `);

  const saleItems =
    (saleItemsData ??
      []) as SaleItem[];

  let totalCost = 0;
  let totalRevenueAll = 0;

  saleItems.forEach(
    (item) => {
      const product =
        Array.isArray(
          item.products
        )
          ? item.products[0]
          : item.products;

      const cost =
        Number(
          product?.cost_price ?? 0
        );

      const quantity =
        Number(
          item.quantity ?? 0
        );

      const price =
        Number(
          item.price ?? 0
        );

      totalCost +=
        cost * quantity;

      totalRevenueAll +=
        price * quantity;
    }
  );

  const grossProfit =
    totalRevenueAll -
    totalCost;

  const profitMargin =
    totalRevenueAll > 0
      ? (
          (grossProfit /
            totalRevenueAll) *
          100
        ).toFixed(1)
      : "0.0";

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
    totalCustomers:
      totalCustomers ?? 0,
    criticalProducts,
    grossProfit,
    profitMargin,
  };
}