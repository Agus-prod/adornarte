import { redirect } from "next/navigation";
import { PaymentForm } from "@/components/catalog/payment-form";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCurrentCartPayments } from "@/lib/catalog/services/payment-service";

export default async function CheckoutPaymentPage() {
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

  const payments =
    await getCurrentCartPayments();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Pago
      </h1>

      <PaymentForm
        cart={cart}
        payments={payments}
      />
    </main>
  );
}
