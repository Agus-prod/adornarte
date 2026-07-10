import { CatalogInfoPage } from "@/components/catalog/catalog-info-page";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

export default async function FaqPage() {
  const [cart, customer] = await Promise.all([
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CatalogInfoPage
      eyebrow="AdornArte Shop"
      title="Preguntas frecuentes"
      description="Respuestas rapidas para comprar con confianza desde el catalogo."
      cart={cart}
      customer={customer}
      sections={[
        {
          title: "Como veo mi pedido",
          body: "Inicia sesion con tu cuenta del catalogo y entra a Mi cuenta para ver pedidos pendientes, entregados e historial.",
        },
        {
          title: "Como pago por transferencia",
          body: "Selecciona transferencia en checkout, usa una cuenta bancaria configurada por AdornArte y adjunta el comprobante para revision.",
        },
        {
          title: "Puedo seguir comprando",
          body: "Si. Puedes agregar productos al carrito sin salir del catalogo y completar el pedido cuando estes lista.",
        },
      ]}
    />
  );
}
