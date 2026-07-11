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
          body: "Los precios, ofertas, cupones y combos pueden cambiar segun disponibilidad, vigencia o temporada. El total valido sera el mostrado al confirmar el pedido.",
        },
        {
          title: "Cuenta del cliente",
          body: "Cada cliente es responsable de mantener sus datos actualizados para recibir seguimiento correcto de pedidos, entregas e historial.",
        },
        {
          title: "Pagos",
          body: "Los pagos por transferencia requieren comprobante. Los pedidos contra entrega o en efectivo se confirman segun disponibilidad y zona de entrega.",
        },
        {
          title: "Entregas",
          body: "La entrega se coordina con los datos proporcionados por el cliente. Si la direccion o telefono son incorrectos, el pedido puede retrasarse.",
        },
        {
          title: "Cambios y devoluciones",
          body: "Los cambios se revisan con comprobante de compra, dentro del plazo informado por la tienda y siempre que el producto cumpla las condiciones necesarias.",
        },
        {
          title: "Uso correcto del sitio",
          body: "El catalogo esta disponible para compras personales y consultas de productos. No se permite usar datos, imagenes o contenido de AdornArte para fines no autorizados.",
        },
      ]}
    />
  );
}
