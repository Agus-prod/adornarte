import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogLoyaltyAccount =
  Tables<"catalog_loyalty_accounts">;

export type CatalogLoyaltyMovement =
  Tables<"catalog_loyalty_movements">;

export async function getLoyaltyAccount(
  organizationId: string,
  customerEmail: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_loyalty_accounts")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("customer_email", customerEmail)
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogLoyaltyAccount | null;
}

export async function createLoyaltyAccount(
  values: TablesInsert<"catalog_loyalty_accounts">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_loyalty_accounts")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogLoyaltyAccount;
}

export async function updateLoyaltyAccount(
  accountId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_loyalty_accounts">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_loyalty_accounts")
    .update(values)
    .eq("id", accountId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogLoyaltyAccount;
}

export async function createLoyaltyMovement(
  values: TablesInsert<"catalog_loyalty_movements">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_loyalty_movements")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogLoyaltyMovement;
}
