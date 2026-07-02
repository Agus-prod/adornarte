import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogPayment =
  Tables<"catalog_payments">;

export async function getCartPayments(
  cartId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_payments")
    .select("*")
    .eq("cart_id", cartId)
    .eq("organization_id", organizationId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogPayment[];
}

export async function createPayment(
  values: TablesInsert<"catalog_payments">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_payments")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogPayment;
}

export async function updatePayment(
  paymentId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_payments">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_payments")
    .update(values)
    .eq("id", paymentId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogPayment;
}
