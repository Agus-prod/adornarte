import { saveCommerceSettings } from "@/app/(dashboard)/configuracion/commerce/actions";
import type { CatalogSettingsView } from "@/lib/catalog/types";

type Props = {
  settings: CatalogSettingsView;
};

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm font-semibold text-zinc-700">
      {children}
    </label>
  );
}

function TextInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="min-h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
    />
  );
}

function TextArea({
  name,
  defaultValue,
  placeholder,
  rows = 3,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      rows={rows}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
    />
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {description}
        </p>
      </div>
      <div className="grid gap-4">
        {children}
      </div>
    </section>
  );
}

export function CommerceSettingsForm({
  settings,
}: Props) {
  const accounts = [
    ...settings.bankAccounts,
  ];

  while (accounts.length < 3) {
    accounts.push({
      id: `empty-${accounts.length}`,
      bankName: "",
      accountName: "",
      accountNumber: "",
      accountType: "",
      currency: "HNL",
    });
  }

  return (
    <form
      action={saveCommerceSettings}
      className="space-y-6"
    >
      <Section
        title="Tienda"
        description="Define como se presenta Commerce ante tus clientes."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Nombre de tienda</FieldLabel>
            <TextInput
              name="shop_name"
              defaultValue={settings.shopName}
              placeholder="AdornArte Shop"
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Frase corta</FieldLabel>
            <TextInput
              name="shop_tagline"
              defaultValue={settings.shopTagline}
              placeholder="Maquillaje para todos los dias"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <FieldLabel>Descripcion publica</FieldLabel>
          <TextArea
            name="shop_description"
            defaultValue={
              settings.shopDescription
            }
            placeholder="Cuenta brevemente que vendes y que puede esperar el cliente."
          />
        </div>
      </Section>

      <Section
        title="Facturacion"
        description="Datos fiscales y de contacto que se usaran en pedidos, recibos y comunicaciones."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Nombre fiscal</FieldLabel>
            <TextInput
              name="billing_name"
              defaultValue={settings.billingName}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>RTN</FieldLabel>
            <TextInput
              name="billing_rtn"
              defaultValue={settings.billingRtn}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Email</FieldLabel>
            <TextInput
              name="billing_email"
              type="email"
              defaultValue={
                settings.billingEmail
              }
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Telefono</FieldLabel>
            <TextInput
              name="billing_phone"
              defaultValue={
                settings.billingPhone
              }
            />
          </div>
        </div>
        <div className="grid gap-2">
          <FieldLabel>Direccion fiscal</FieldLabel>
          <TextArea
            name="billing_address"
            defaultValue={
              settings.billingAddress
            }
            rows={2}
          />
        </div>
      </Section>

      <Section
        title="WhatsApp y notificaciones"
        description="Configura donde te llegan los pedidos y que numero ve el cliente."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>WhatsApp publico</FieldLabel>
            <TextInput
              name="whatsapp_number"
              defaultValue={
                settings.whatsappNumber
              }
              placeholder="+504..."
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Recibir pedidos en</FieldLabel>
            <TextInput
              name="order_whatsapp_recipient"
              defaultValue={
                settings.orderWhatsappRecipient
              }
              placeholder="+504..."
            />
          </div>
        </div>
      </Section>

      <Section
        title="Cuentas bancarias"
        description="Estas cuentas apareceran cuando el cliente elija transferencia."
      >
        <div className="grid gap-4">
          {accounts.slice(0, 3).map(
            (account, index) => (
              <div
                key={account.id}
                className="grid gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4 md:grid-cols-5"
              >
                <TextInput
                  name={`bank_${index}_name`}
                  defaultValue={
                    account.bankName
                  }
                  placeholder="Banco"
                />
                <TextInput
                  name={`bank_${index}_account_name`}
                  defaultValue={
                    account.accountName
                  }
                  placeholder="Titular"
                />
                <TextInput
                  name={`bank_${index}_account_number`}
                  defaultValue={
                    account.accountNumber
                  }
                  placeholder="Numero"
                />
                <TextInput
                  name={`bank_${index}_account_type`}
                  defaultValue={
                    account.accountType
                  }
                  placeholder="Tipo"
                />
                <TextInput
                  name={`bank_${index}_currency`}
                  defaultValue={
                    account.currency
                  }
                  placeholder="HNL"
                />
              </div>
            )
          )}
        </div>
      </Section>

      <Section
        title="Checkout"
        description="Textos legales, instrucciones y politicas que acompanan la compra."
      >
        <div className="grid gap-2">
          <FieldLabel>Notas de checkout</FieldLabel>
          <TextArea
            name="checkout_notes"
            defaultValue={
              settings.checkoutNotes
            }
            placeholder="Ej. Los pedidos se preparan despues de confirmar el pago."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Politica de privacidad</FieldLabel>
            <TextInput
              name="privacy_policy_url"
              defaultValue={
                settings.privacyPolicyUrl
              }
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Terminos</FieldLabel>
            <TextInput
              name="terms_url"
              defaultValue={settings.termsUrl}
              placeholder="https://..."
            />
          </div>
        </div>
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-pink-600 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-200 hover:bg-pink-700"
        >
          Guardar configuracion
        </button>
      </div>
    </form>
  );
}
