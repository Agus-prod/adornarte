import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type SaleItemRow = {
  quantity: number | null;
  products:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
};

export async function getTopProduct() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const {
    data: sales,
    error: salesError,
  } = await supabase
    .from("sales")
    .select("id")
    .eq(
      "organization_id",
      profile.organization_id
    );

  if (salesError) {
    throw salesError;
  }

  if (!sales?.length) {
    return null;
  }

  const saleIds = sales.map(
    (sale) => sale.id
  );

  const { data, error } =
    await supabase
      .from("sale_items")
      .select(`
        quantity,
        products (
          id,
          name
        )
      `)
      .in(
        "sale_id",
        saleIds
      );

  if (error) {
    throw error;
  }

  if (!data?.length) {
    return null;
  }

  const totals = new Map<
    string,
    {
      name: string;
      quantity: number;
    }
  >();

  (data as SaleItemRow[]).forEach(
    (item) => {
      const product =
        Array.isArray(
          item.products
        )
          ? item.products[0]
          : item.products;

      if (!product) {
        return;
      }

      const quantity =
        Number(
          item.quantity ?? 0
        );

      const current =
        totals.get(product.id);

      if (current) {
        current.quantity +=
          quantity;
      } else {
        totals.set(
          product.id,
          {
            name:
              product.name,
            quantity,
          }
        );
      }
    }
  );

  const topProduct =
    [...totals.values()].sort(
      (a, b) =>
        b.quantity -
        a.quantity
    )[0];

  return topProduct ?? null;
}