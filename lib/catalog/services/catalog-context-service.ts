export function getPublicCatalogOrganizationId() {
  return (
    process.env.CATALOG_ORGANIZATION_ID ??
    process.env.NEXT_PUBLIC_CATALOG_ORGANIZATION_ID ??
    null
  );
}
