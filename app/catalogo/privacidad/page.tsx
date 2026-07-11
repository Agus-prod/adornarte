import { CatalogInfoPage } from "@/components/catalog/catalog-info-page";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

export default async function PrivacyPage() {
  const [cart, customer] = await Promise.all([
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CatalogInfoPage
      eyebrow="AdornArte Shop"
      title="Politica de privacidad"
      description="Cuidamos los datos que usas para comprar, consultar pedidos y recibir atencion."
      cart={cart}
      customer={customer}
      sections={[
        {
          title: "Datos que guardamos",
          body: "Registramos tu nombre, correo, telefono, direcciones y pedidos para procesar compras, entregas, cambios y seguimiento dentro de AdornArte.",
        },
        {
          title: "Uso de la informacion",
          body: "Usamos tus datos solamente para operar la tienda, confirmar pedidos, coordinar entregas, enviar recordatorios y mejorar la experiencia de compra.",
        },
        {
          title: "Seguridad",
          body: "Tu cuenta se protege con autenticacion. No compartimos tu informacion con terceros salvo cuando sea necesario para entregar o atender tu pedido.",
        },
        {
          title: "Comunicaciones",
          body: "Podemos contactarte por telefono, WhatsApp o correo para confirmar datos, avisar cambios de estado, validar pagos o resolver dudas sobre tu pedido.",
        },
        {
          title: "Comprobantes de pago",
          body: "Si subes una captura de transferencia, se usara solo para validar tu pago y asociarlo al pedido correspondiente.",
        },
        {
          title: "Actualizacion de datos",
          body: "Puedes revisar y actualizar tu informacion desde Mi cuenta para que tus pedidos, entregas e historial se mantengan correctos.",
        },
        {
          title: "Conservacion",
          body: "Guardamos la informacion necesaria para historial de compras, comprobantes, soporte, cambios y obligaciones comerciales aplicables.",
        },
      ]}
    />
  );
}
