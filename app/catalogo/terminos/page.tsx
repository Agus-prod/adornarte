import { CatalogInfoPage } from "@/components/catalog/catalog-info-page";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

export default async function TermsPage() {
  const [cart, customer] = await Promise.all([
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CatalogInfoPage
      eyebrow="AdornArte Shop"
      title="Terminos y condiciones"
      description="Estas condiciones ayudan a mantener compras claras, ordenadas y seguras."
      cart={cart}
      customer={customer}
      sections={[
        {
          title: "Pedidos",
          body: "Todo pedido queda sujeto a disponibilidad de inventario, confirmacion de datos y validacion del pago seleccionado.",
        },
        {
          title: "Precios y promociones",
          body: "Los precios, ofertas, cupones y combos pueden cambiar segun disponibilidad, vigencia y configuracion del catalogo.",
        },
        {
          title: "Cuenta del cliente",
          body: "Cada cliente es responsable de mantener sus datos actualizados para recibir seguimiento correcto de pedidos, entregas e historial.",
        },
      ]}
    />
  );
}
