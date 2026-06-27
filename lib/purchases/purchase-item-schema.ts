import { z } from "zod";

export const purchaseItemSchema = z.object({
  purchase_order_id: z
    .string()
    .uuid(),

  product_id: z
    .string()
    .uuid(),

  quantity: z
    .number()
    .min(1, "La cantidad debe ser mayor a cero."),

  cost_price: z
  .number()
  .positive("Ingrese un costo mayor que cero."),
});

export type PurchaseItemFormValues =
  z.infer<typeof purchaseItemSchema>;