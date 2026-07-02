import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/catalog/checkout-form";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";

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

  const cart = await getCartDetail();

  if (!cart || cart.items.length === 0) {
    redirect("/catalogo/carrito");
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Checkout
      </h1>

      <CheckoutForm cart={cart} />
    </main>
  );
}
