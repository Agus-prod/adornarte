import { CommerceReadiness } from "@/components/catalog/commerce-readiness";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCommerceReadiness } from "@/lib/catalog/services/readiness-service";

export default async function CommerceReadinessPage() {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          Catalogo no configurado
        </h1>
      </main>
    );
  }

  const items =
    await getCommerceReadiness(
      organizationId
    );

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Commerce V1
      </h1>
      <CommerceReadiness items={items} />
    </main>
  );
}
