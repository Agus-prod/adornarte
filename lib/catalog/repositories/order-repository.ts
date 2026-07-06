import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogOrder =
  Tables<"catalog_orders">;

export type CatalogOrderItem =
  Tables<"catalog_order_items">;

export async function createOrder(
  values: TablesInsert<"catalog_orders">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_orders")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogOrder;
}

export async function createOrderItems(
  values: TablesInsert<"catalog_order_items">[]
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_order_items")
    .insert(values)
    .select();

  if (error) throw error;

  return data satisfies CatalogOrderItem[];
}

export async function getOrder(
  orderId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_orders")
    .select("*")
    .eq("id", orderId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;

  return data satisfies CatalogOrder;
}

export async function getOrderItems(
  orderId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_order_items")
    .select("*")
    .eq("order_id", orderId)
    .eq("organization_id", organizationId)
    .order("created_at");

  if (error) throw error;

  return data satisfies CatalogOrderItem[];
}

export async function updateOrder(
  orderId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_orders">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_orders")
    .update(values)
    .eq("id", orderId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogOrder;
}
