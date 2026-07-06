import { CatalogStorefrontHeader } from "@/components/catalog/catalog-storefront-header";
import { CustomerAccount } from "@/components/catalog/customer-account";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
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

  const [account, cart] =
    await Promise.all([
      getCustomerAccount(),
      getCartDetail(),
    ]);

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogStorefrontHeader
        cart={cart}
        customer={account?.customer ?? null}
        showBack
      />

      <section className="border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold uppercase text-pink-600">
            AdornArte Shop
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Mi cuenta
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Revisa tus pedidos, guarda tus direcciones y mantén tus datos listos para comprar más rápido.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <CustomerAccount
          account={account}
        />
      </div>
    </main>
  );
}
