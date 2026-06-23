import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type MovementType =
  | "ENTRADA"
  | "SALIDA"
  | "AJUSTE";

export async function createStockMovement({
  productId,
  movementType,
  quantity,
  notes,
}: {
  productId: string;
  movementType: MovementType;
  quantity: number;
  notes?: string;
}) {
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
    data: product,
    error: productError,
  } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (productError) {
    throw productError;
  }

  let newStock =
    product.stock ?? 0;

  if (
    movementType === "ENTRADA"
  ) {
    newStock += quantity;
  }

  if (
    movementType === "SALIDA"
  ) {
    newStock -= quantity;

    if (newStock < 0) {
      throw new Error(
        "Stock insuficiente"
      );
    }
  }

  if (
    movementType === "AJUSTE"
  ) {
    newStock = quantity;
  }

  const {
    error: stockError,
  } = await supabase
    .from("products")
    .update({
      stock: newStock,
    })
    .eq("id", productId);

  if (stockError) {
    throw stockError;
  }

  const {
    error: movementError,
  } = await supabase
    .from("stock_movements")
    .insert({
  organization_id:
    profile.organization_id,

  created_by:
    profile.id,

  product_id:
    productId,

  movement_type:
    movementType,

  quantity,

  notes:
    notes ?? null,
});

  if (movementError) {
    throw movementError;
  }
}