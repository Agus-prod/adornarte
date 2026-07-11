import { CatalogInfoPage } from "@/components/catalog/catalog-info-page";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

export default async function ShippingPage() {
  const [cart, customer] = await Promise.all([
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CatalogInfoPage
      eyebrow="AdornArte Shop"
      title="Envios y devoluciones"
      description="Coordinamos entregas y cambios con una comunicacion clara desde tu cuenta."
      cart={cart}
      customer={customer}
      sections={[
        {
          title: "Entregas",
          body: "Al completar tu pedido, AdornArte revisa la informacion y coordina el metodo de entrega segun ciudad, direccion y disponibilidad.",
        },
        {
          title: "Datos necesarios",
          body: "Para coordinar correctamente necesitamos nombre, telefono, ciudad, direccion clara y cualquier referencia importante del lugar de entrega.",
        },
        {
          title: "Tiempos de entrega",
          body: "Los tiempos pueden variar segun disponibilidad, zona, clima, horario y volumen de pedidos. Te avisaremos cualquier cambio importante.",
        },
        {
          title: "Cambios",
          body: "Los cambios se atienden con el comprobante del pedido y dentro de las condiciones acordadas para cada producto.",
        },
        {
          title: "Productos en promocion",
          body: "Las promociones y combos pueden tener condiciones especiales. Revisa la descripcion del producto y confirma cualquier duda antes de completar el pedido.",
        },
        {
          title: "Seguimiento",
          body: "Puedes revisar pedidos pendientes, enviados y entregados desde tu cuenta del catalogo.",
        },
      ]}
    />
  );
}
