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
      ]}
    />
  );
}
