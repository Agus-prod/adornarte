import { z } from "zod";

export const purchaseOrderSchema = z.object({
  supplier_id: z
    .string()
    .uuid("Seleccione un proveedor."),

  order_date: z
    .string()
    .min(1, "Seleccione una fecha."),

  notes: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),
});

export type PurchaseOrderFormValues =
  z.infer<typeof purchaseOrderSchema>;

export const defaultPurchaseOrderValues: PurchaseOrderFormValues = {
  supplier_id: "",
  order_date: new Date()
    .toISOString()
    .split("T")[0],
  notes: "",
};