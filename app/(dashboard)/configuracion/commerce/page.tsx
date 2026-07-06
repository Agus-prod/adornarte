import { CommerceSettingsForm } from "@/components/catalog/commerce-settings-form";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getCatalogSettingsView } from "@/lib/catalog/services/settings-service";

export default async function CommerceSettingsPage() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const settings =
    await getCatalogSettingsView(
      profile.organization_id
    );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink-500">
          Commerce
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Configuracion de tienda
        </h1>
        <p className="mt-2 max-w-3xl text-gray-500">
          Centraliza datos de tienda, facturacion, cuentas bancarias, WhatsApp, checkout y notificaciones.
        </p>
      </div>

      <CommerceSettingsForm
        settings={settings}
      />
    </div>
  );
}
