import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { roleScopes } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";

type Props = {
  role: UserRole;
  pathname: string;
};

export function AccessDenied({
  role,
  pathname,
}: Props) {
  const scope = roleScopes[role];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
      <section className="w-full rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <ShieldAlert size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
              Acceso restringido
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Esta funcion no esta disponible para tu rol
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Tu perfil actual es {scope.label}. La ruta solicitada fue {pathname}. Si necesitas entrar aqui, un administrador debe cambiar tu rol.
            </p>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
              <h2 className="text-sm font-bold">
                Tu rol puede hacer:
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-600">
                {scope.capabilities.map(
                  (capability) => (
                    <li key={capability}>
                      {capability}
                    </li>
                  )
                )}
              </ul>
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-pink-600 px-5 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
