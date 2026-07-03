import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/database.types";

export type CatalogCmsPage =
  Tables<"catalog_cms_pages">;

export async function getPublishedCmsPages(
  organizationId: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_cms_pages")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_published", true)
    .order("published_at", {
      ascending: false,
    });

  if (error) throw error;

  return data satisfies CatalogCmsPage[];
}

export async function getPublishedCmsPageBySlug(
  organizationId: string,
  slug: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catalog_cms_pages")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;

  return data satisfies CatalogCmsPage | null;
}
