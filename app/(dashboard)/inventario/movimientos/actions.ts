"use server";

import { redirect } from "next/navigation";
import { createStockMovement } from "@/lib/stock/create-stock-movement";

export async function createMovement(
  formData: FormData
) {
  const productId =
    formData
      .get("product_id")
      ?.toString() ?? "";

  const movementType =
    formData
      .get("movement_type")
      ?.toString() ?? "";

  const quantity = Number(
    formData.get("quantity") ?? 0
  );

  const notes =
    formData
      .get("notes")
      ?.toString() ?? "";

  await createStockMovement({
    productId,
    movementType:
      movementType as
        | "ENTRADA"
        | "SALIDA"
        | "AJUSTE",
    quantity,
    notes,
  });

  redirect(
    "/inventario/movimientos"
  );
}