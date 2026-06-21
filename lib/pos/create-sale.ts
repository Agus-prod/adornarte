import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type SaleItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createSale(
  items: SaleItem[]
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const total = items.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  );

  const {
    data: sale,
    error: saleError,
  } = await supabase
    .from("sales")
    .insert({
      organization_id:
        profile.organization_id,
      total,
    })
    .select()
    .single();

  if (saleError) {
    throw saleError;
  }

  const saleItems =
    items.map((item) => ({
      sale_id: sale.id,
      product_id:
        item.productId,
      quantity:
        item.quantity,
      price: item.price,
    }));

  const {
    error: itemsError,
  } = await supabase
    .from("sale_items")
    .insert(saleItems);

  if (itemsError) {
    throw itemsError;
  }

  for (const item of items) {
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("stock")
      .eq(
        "id",
        item.productId
      )
      .single();

    if (productError) {
      throw productError;
    }

    const newStock =
      (product.stock ?? 0) -
      item.quantity;

    if (newStock < 0) {
      throw new Error(
        "Stock insuficiente"
      );
    }

    const {
      error: updateError,
    } = await supabase
      .from("products")
      .update({
        stock: newStock,
      })
      .eq(
        "id",
        item.productId
      );

    if (updateError) {
      throw updateError;
    }
  }

  return sale;
}