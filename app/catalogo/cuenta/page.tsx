import { CustomerAccount } from "@/components/catalog/customer-account";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCustomerAccount } from "@/lib/catalog/services/customer-service";

export default async function CatalogAccountPage() {
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

  const account =
    await getCustomerAccount();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Mi cuenta
      </h1>

      <CustomerAccount
        account={account}
      />
    </main>
  );
}
