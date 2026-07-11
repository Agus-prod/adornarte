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
      variant="faq"
      sections={[
        {
          title: "Como compro en AdornArte Shop?",
          body: "Agrega productos al carrito, revisa cantidades, completa tus datos de entrega y confirma el metodo de pago. Al finalizar, tu pedido queda registrado para seguimiento.",
        },
        {
          title: "Como veo mi pedido?",
          body: "Inicia sesion con tu cuenta y entra a Mi cuenta. Ahi veras pedidos pendientes, en preparacion, entregados e historial de compras.",
        },
        {
          title: "Puedo comprar sin crear cuenta?",
          body: "Puedes explorar productos libremente. Para dar seguimiento a tus pedidos y proteger tu historial, te recomendamos crear una cuenta antes de finalizar la compra.",
        },
        {
          title: "Como pago por transferencia?",
          body: "Selecciona transferencia en checkout, usa una de las cuentas bancarias disponibles y adjunta la captura del comprobante para que podamos validarlo.",
        },
        {
          title: "Puedo pagar contra entrega?",
          body: "Si la opcion esta disponible al finalizar el pedido, puedes elegir contra entrega y coordinar el pago al recibir tus productos.",
        },
        {
          title: "Puedo seguir comprando despues de agregar al carrito?",
          body: "Si. Puedes seguir viendo productos y el carrito se mantiene disponible para revisar cantidades, cupones, subtotal y total.",
        },
        {
          title: "Que pasa si un producto se agota?",
          body: "Los pedidos dependen de disponibilidad. Si un producto se agota antes de confirmar, te contactaremos para coordinar cambio, espera o cancelacion.",
        },
        {
          title: "Puedo cambiar mi direccion de entrega?",
          body: "Puedes actualizar tus datos desde Mi cuenta. Si el pedido ya esta en ruta, contactanos cuanto antes para revisar si aun es posible modificarlo.",
        },
        {
          title: "Como solicito un cambio?",
          body: "Conserva tu comprobante de compra y contactanos por los canales de atencion. Revisaremos el caso segun el estado del producto y las condiciones de cambio.",
        },
      ]}
    />
  );
}
