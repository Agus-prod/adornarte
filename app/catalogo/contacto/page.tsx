import { CatalogInfoPage } from "@/components/catalog/catalog-info-page";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

export default async function ContactPage() {
  const [cart, customer] = await Promise.all([
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CatalogInfoPage
      eyebrow="AdornArte Shop"
      title="Contacto"
      description="Estamos para ayudarte con pedidos, entregas, pagos y cambios."
      cart={cart}
      customer={customer}
      sections={[
        {
          title: "Atencion de pedidos",
          body: "Usa tu cuenta para revisar el estado de tus pedidos y mantener tus datos de entrega actualizados.",
        },
        {
          title: "Pagos",
          body: "Si pagaste por transferencia, adjunta el comprobante desde checkout para que el equipo lo revise en la app interna.",
        },
        {
          title: "Soporte",
          body: "Para dudas sobre productos, cambios o entregas, comunicate directamente con AdornArte por los canales configurados por la tienda.",
        },
      ]}
    />
  );
}
