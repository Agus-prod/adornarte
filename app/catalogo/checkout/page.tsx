import { redirect } from "next/navigation";
import { CatalogStorefrontHeader } from "@/components/catalog/catalog-storefront-header";
import { CheckoutForm } from "@/components/catalog/checkout-form";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";
import { getConfiguredCatalogBankAccounts } from "@/lib/catalog/services/bank-account-service";

export default async function CheckoutPage() {
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

  const [cart, customer, bankAccounts] =
    await Promise.all([
      getCartDetail(),
      getCurrentCatalogCustomer(),
      getConfiguredCatalogBankAccounts(
        organizationId
      ),
    ]);

  if (!cart || cart.items.length === 0) {
    redirect("/catalogo/carrito");
  }

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogStorefrontHeader
        cart={cart}
        customer={customer}
        showBack
      />

      <section className="border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)]">
        <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
          <p className="text-xs font-semibold uppercase text-pink-600 sm:text-sm">
            AdornArte Shop
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Finalizar compra
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Confirma tus datos, elige tu forma de pago y deja tu pedido listo para entrega.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <CheckoutForm
          cart={cart}
          customer={customer}
          bankAccounts={bankAccounts}
        />
      </div>
    </main>
  );
}
