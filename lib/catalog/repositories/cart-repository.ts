import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogCart =
  Tables<"catalog_carts">;

export type CatalogCartItem =
  Tables<"catalog_cart_items">;

export async function getCart(
  cartId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_carts")
    .select("*")
    .eq("id", cartId)
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogCart | null;
}

export async function createCart(
  values: TablesInsert<"catalog_carts">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_carts")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCart;
}

export async function updateCart(
  cartId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_carts">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_carts")
    .update(values)
    .eq("id", cartId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCart;
}

export async function getCartItems(
  cartId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("organization_id", organizationId)
    .order("created_at");

  if (error) throw error;

  return data satisfies CatalogCartItem[];
}

export async function getCartItemByProduct(
  cartId: string,
  productId: string,
  variantId: string | null
) {
  const supabase = createAdminClient();
  let query = supabase
    .from("catalog_cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId);

  query = variantId
    ? query.eq("variant_id", variantId)
    : query.is("variant_id", null);

  const { data, error } =
    await query.maybeSingle();

  if (error) throw error;

  return data satisfies CatalogCartItem | null;
}

export async function createCartItem(
  values: TablesInsert<"catalog_cart_items">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_cart_items")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCartItem;
}

export async function updateCartItem(
  itemId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_cart_items">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_cart_items")
    .update(values)
    .eq("id", itemId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogCartItem;
}

export async function deleteCartItem(
  itemId: string,
  organizationId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("catalog_cart_items")
    .delete()
    .eq("id", itemId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function createCartRealtimeEvent(
  cartId: string,
  eventType: string
) {
  const supabase = createAdminClient();

  const { error } = await (
    supabase as any
  )
    .from("catalog_cart_realtime_events")
    .insert({
      cart_id: cartId,
      event_type: eventType,
    });

  if (error) throw error;
}
