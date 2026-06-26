import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(150, "El nombre es demasiado largo."),

  contact_name: z
    .string()
    .trim()
    .max(150, "El contacto es demasiado largo.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "El teléfono es demasiado largo.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Correo electrónico inválido.")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(300, "La dirección es demasiado larga.")
    .optional()
    .or(z.literal("")),

  rtn: z
    .string()
    .trim()
    .max(50, "El RTN es demasiado largo.")
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .trim()
    .max(500, "Las notas son demasiado largas.")
    .optional()
    .or(z.literal("")),

  is_active: z.boolean(),
});

export type SupplierFormValues = z.infer<
  typeof supplierSchema
>;