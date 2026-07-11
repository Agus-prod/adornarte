import { CatalogStorefrontHeader } from "@/components/catalog/catalog-storefront-header";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";
import { getCatalogSettingsView } from "@/lib/catalog/services/settings-service";

function cleanPhone(value: string | null) {
  return value?.replace(/\D/g, "") ?? "";
}

function getWhatsAppHref(value: string | null) {
  const phone = cleanPhone(value);

  return phone
    ? `https://wa.me/${phone}`
    : null;
}

export default async function ContactPage() {
  const organizationId =
    getPublicCatalogOrganizationId();
  const [cart, customer, settings] =
    await Promise.all([
      getCartDetail(),
      getCurrentCatalogCustomer(),
      organizationId
        ? getCatalogSettingsView(
            organizationId
          )
        : Promise.resolve(null),
    ]);
  const shopName =
    settings?.shopName ?? "AdornArte Shop";
  const phone =
    settings?.billingPhone ?? null;
  const whatsapp =
    settings?.whatsappNumber ??
    settings?.orderWhatsappRecipient ??
    null;
  const whatsappHref =
    getWhatsAppHref(whatsapp);
  const email =
    settings?.billingEmail ?? null;
  const contactPhone =
    phone ?? whatsapp;

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogStorefrontHeader
        cart={cart}
        customer={customer}
        showBack
      />

      <section className="border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase text-pink-600">
            {shopName}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
            Estamos para ayudarte con pedidos,
            entregas, pagos, cambios y dudas
            sobre tus productos.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-8 sm:grid-cols-2">
        <article className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50">
          <p className="text-xs font-semibold uppercase text-pink-600">
            WhatsApp
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Atencion directa
          </h2>
          <p className="mt-2 leading-7 text-zinc-600">
            Escribenos para consultas de
            productos, pedidos, pagos,
            cambios, garantias o entregas a
            nivel nacional.
          </p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-pink-600 px-5 text-sm font-bold text-white"
            >
              Abrir WhatsApp
            </a>
          ) : (
            <p className="mt-4 rounded-2xl bg-pink-50 p-3 text-sm text-zinc-600">
              Disponible al confirmar tu
              pedido.
            </p>
          )}
        </article>

        <article className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50">
          <p className="text-xs font-semibold uppercase text-pink-600">
            Telefono
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Telefono de la tienda
          </h2>
          <p className="mt-2 leading-7 text-zinc-600">
            {contactPhone ??
              "Atendemos consultas por WhatsApp desde el boton de contacto."}
          </p>
          {contactPhone ? (
            <a
              href={`tel:${cleanPhone(contactPhone)}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-pink-200 px-5 text-sm font-bold text-pink-600"
            >
              Llamar ahora
            </a>
          ) : null}
        </article>

        <article className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50">
          <p className="text-xs font-semibold uppercase text-pink-600">
            Correo
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Correo de contacto
          </h2>
          <p className="mt-2 leading-7 text-zinc-600">
            {email ??
              "Si necesitas soporte por correo, escribenos por WhatsApp y te compartimos el canal disponible."}
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-pink-200 px-5 text-sm font-bold text-pink-600"
            >
              Enviar correo
            </a>
          ) : null}
        </article>

        <article className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50">
          <p className="text-xs font-semibold uppercase text-pink-600">
            Cobertura
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Entregas nacionales
          </h2>
          <p className="mt-2 leading-7 text-zinc-600">
            Enviamos y coordinamos entregas
            a nivel nacional. Al completar tu
            pedido revisamos ciudad,
            direccion, disponibilidad y forma
            de pago para darte seguimiento.
          </p>
        </article>
      </section>
    </main>
  );
}
