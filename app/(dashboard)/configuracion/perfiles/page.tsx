import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { roleScopes } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { StaffUserForm } from "@/components/users/staff-user-form";

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
          Usuarios y roles
        </h1>
        <p className="mt-2 text-gray-500">
          Crea accesos al sistema y asigna el rol de cada persona.
        </p>
      </div>

      <StaffUserForm />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(roleScopes).map(
          ([role, scope]) => (
            <div
              key={role}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <h2 className="font-bold capitalize">
                {scope.label}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {scope.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                {scope.capabilities.map(
                  (capability) => (
                    <li key={capability}>
                      {capability}
                    </li>
                  )
                )}
              </ul>
            </div>
          )
        )}
      </div>

      <div className="grid gap-3 md:hidden">
        {(data ?? []).map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
          >
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold">
                {item.full_name ?? item.email}
              </h2>
              <p className="mt-1 break-all text-sm text-zinc-500">
                {item.email}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold capitalize text-pink-700">
                {item.role}
              </span>
              <span
                className={
                  item.is_active === false
                    ? "rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700"
                    : "rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
                }
              >
                {item.is_active === false
                  ? "Inactivo"
                  : "Activo"}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border bg-white shadow-sm md:block">
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
