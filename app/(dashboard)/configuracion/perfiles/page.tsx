import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createAdminClient } from "@/lib/supabase/admin";

const roleScopes = {
  admin:
    "Acceso completo a ERP, POS, Commerce, reportes y configuracion.",
  caja:
    "Caja, POS, ventas, cobros y clientes.",
  inventario:
    "Productos, stock, movimientos y compras.",
  vendedor:
    "POS, catalogo, clientes y ventas propias.",
};

export default async function PerfilesPage() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, is_active"
    )
    .eq(
      "organization_id",
      profile.organization_id
    )
    .order("email");

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Perfiles y roles
        </h1>
        <p className="mt-2 text-gray-500">
          Base para administrar visibilidad y accesos por rol.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(roleScopes).map(
          ([role, description]) => (
            <div
              key={role}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <h2 className="font-bold capitalize">
                {role}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            </div>
          )
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-4">
                  <div className="font-semibold">
                    {item.full_name ??
                      item.email}
                  </div>
                  <div className="text-gray-500">
                    {item.email}
                  </div>
                </td>
                <td className="p-4 capitalize">
                  {item.role}
                </td>
                <td className="p-4">
                  {item.is_active === false
                    ? "Inactivo"
                    : "Activo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
