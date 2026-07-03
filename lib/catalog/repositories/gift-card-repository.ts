import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";

export type CatalogGiftCard =
  Tables<"catalog_gift_cards">;

export async function getGiftCardByCode(
  organizationId: string,
  code: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_gift_cards")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogGiftCard | null;
}

export async function createGiftCard(
  values: TablesInsert<"catalog_gift_cards">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_gift_cards")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogGiftCard;
}

export async function updateGiftCard(
  giftCardId: string,
  organizationId: string,
  values: TablesUpdate<"catalog_gift_cards">
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_gift_cards")
    .update(values)
    .eq("id", giftCardId)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw error;

  return data satisfies CatalogGiftCard;
}
