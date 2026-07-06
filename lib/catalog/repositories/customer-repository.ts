import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogCustomer =
  Tables<"catalog_customers">;

export type CatalogCustomerAddress =
  Tables<"catalog_customer_addresses">;

function isMissingColumnError(
  error: {
    code?: string;
    message?: string;
  } | null
) {
  return (
    error?.code === "42703" ||
    (error?.code === "PGRST204" &&
      error.message?.includes(
        "auth_user_id"
      ))
  );
}

export async function getCustomerByEmail(
  organizationId: string,
  email: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customers")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (isMissingColumnError(error)) {
    return null;
  }

  if (error) throw error;

  return data satisfies CatalogCustomer | null;
}

export async function getCustomerByAuthUserId(
  organizationId: string,
  authUserId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customers")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (isMissingColumnError(error)) {
    return null;
  }

  if (error) throw error;

  return data satisfies CatalogCustomer | null;
}

export async function createCustomer(
  values: TablesInsert<"catalog_customers">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customers")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCustomer;
}

export async function updateCustomer(
  customerId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_customers">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customers")
    .update(values)
    .eq("id", customerId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCustomer;
}

export async function getCustomerAddresses(
  customerId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customer_addresses")
    .select("*")
    .eq("customer_id", customerId)
    .eq("organization_id", organizationId)
    .order("is_default", {
      ascending: false,
    })
    .order("created_at");

  if (error) throw error;

  return data satisfies CatalogCustomerAddress[];
}

export async function createCustomerAddress(
  values: TablesInsert<"catalog_customer_addresses">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_customer_addresses")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCustomerAddress;
}
