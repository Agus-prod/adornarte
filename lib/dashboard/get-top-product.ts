import { createClient } from "@/lib/supabase/server";

export async function getTopProduct() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("sale_items")
      .select(`
        quantity,
        products (
          id,
          name
        )
      `);

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

  data.forEach((item: any) => {
    const product =
      Array.isArray(item.products)
        ? item.products[0]
        : item.products;

    if (!product) return;

    const current =
      totals.get(product.id);

    if (current) {
      current.quantity +=
        item.quantity ?? 0;
    } else {
      totals.set(product.id, {
        name: product.name,
        quantity:
          item.quantity ?? 0,
      });
    }
  });

  const topProduct =
    [...totals.values()].sort(
      (a, b) =>
        b.quantity - a.quantity
    )[0];

  return topProduct ?? null;
}