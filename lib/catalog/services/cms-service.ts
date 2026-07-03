import {
  getPublishedCmsPageBySlug,
  getPublishedCmsPages,
} from "@/lib/catalog/repositories/cms-repository";

export async function getCatalogCmsPages(
  organizationId: string
) {
  return getPublishedCmsPages(
    organizationId
  );
}

export async function getCatalogCmsPage(
  organizationId: string,
  slug: string
) {
  return getPublishedCmsPageBySlug(
    organizationId,
    slug
  );
}
