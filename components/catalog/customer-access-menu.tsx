"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import {
  createCatalogCustomerAccountInline,
  loginCatalogCustomerInline,
  logoutCatalogCustomer,
  type CatalogAccountActionState,
} from "@/app/catalogo/cuenta/actions";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";

type Props = {
  customer: CatalogCustomer | null;
};

const idleState: CatalogAccountActionState = {
  status: "idle",
  message: null,
};

function SubmitButton({
  children,
  className,
  pendingLabel = "Procesando...",
}: {
  children: React.ReactNode;
  className: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function CustomerAccessMenu({
  customer,
}: Props) {
  const router = useRouter();
  const [
    loginState,
    loginAction,
  ] = useActionState(
    loginCatalogCustomerInline,
    idleState
  );
  const [
    createState,
    createAction,
  ] = useActionState(
    createCatalogCustomerAccountInline,
    idleState
  );
  const customerLabel =
    customer?.name.split(" ")[0] ??
    "Cuenta";
  const currentState =
    createState.status !== "idle"
      ? createState
      : loginState.status !== "idle"
        ? loginState
        : idleState;

  useEffect(() => {
    if (
      loginState.status === "success" ||
      createState.status === "success"
    ) {
      router.refresh();
    }
  }, [
    createState.status,
    loginState.status,
    router,
  ]);

  return (
    <details
      className="group relative"
      data-catalog-menu
    >
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-zinc-700 hover:bg-white hover:text-pink-700">
        <span className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm">
          <UserRound
            className="size-4"
            aria-hidden="true"
          />
        </span>
        <span className="hidden sm:inline">
          {customerLabel}
        </span>
      </summary>

      <div
        data-dropdown-panel
        className="fixed inset-x-3 top-16 z-30 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain touch-pan-y rounded-2xl border border-pink-100 bg-white p-4 shadow-2xl shadow-pink-100/70 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[22rem] sm:max-w-[calc(100vw-2rem)] sm:rounded-3xl"
      >
        <p className="text-xs font-semibold uppercase text-pink-600">
          Acceso cliente
        </p>
        {customer ? (
          <>
            <h2 className="mt-1 text-lg font-bold tracking-tight">
              Hola {customer.name}, bienvenido a AdornArte!
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Puedes revisar tus pedidos, direcciones e historial.
            </p>

            <div className="mt-4 grid gap-2">
              <Link
                href="/catalogo/cuenta"
                className="flex min-h-10 items-center justify-between rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Ver mi cuenta
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <form action={logoutCatalogCustomer}>
                <button
                  type="submit"
                  className="min-h-10 w-full rounded-2xl border border-zinc-200 px-4 text-left text-sm font-semibold text-zinc-700 hover:border-pink-200 hover:text-pink-700"
                >
                  Cerrar sesion
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-1 text-lg font-bold tracking-tight">
              Tu cuenta de AdornArte
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Entra con tu email y contrasena para ver pedidos, direcciones e historial.
            </p>

            <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
              {currentState.message ? (
                <div
                  className={
                    currentState.status ===
                    "success"
                      ? "mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
                      : "mb-3 rounded-2xl border border-pink-100 bg-pink-50 p-3 text-sm font-semibold text-pink-700"
                  }
                >
                  {currentState.message}
                </div>
              ) : null}
              <p className="text-sm font-semibold">
                Ya tengo cuenta
              </p>
              <form
                action={loginAction}
                className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="min-h-10 min-w-0 rounded-2xl border border-zinc-200 bg-white px-3 text-sm"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Contrasena"
                  className="min-h-10 min-w-0 rounded-2xl border border-zinc-200 bg-white px-3 text-sm"
                />
                <SubmitButton
                  className="min-h-10 w-full rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
                  pendingLabel="Entrando..."
                >
                  Iniciar
                </SubmitButton>
              </form>
            </div>

            <div className="my-4 h-px bg-zinc-100" />

            <p className="text-sm font-semibold">
              Crear mi cuenta
            </p>

            <form
              action={createAction}
              className="mt-3 space-y-2"
            >
              <input
                name="name"
                required
                placeholder="Nombre"
                className="min-h-10 w-full rounded-2xl border border-zinc-200 px-3 text-sm"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="min-h-10 w-full rounded-2xl border border-zinc-200 px-3 text-sm"
              />
              <input
                name="phone"
                placeholder="WhatsApp"
                className="min-h-10 w-full rounded-2xl border border-zinc-200 px-3 text-sm"
              />
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Contrasena"
                className="min-h-10 w-full rounded-2xl border border-zinc-200 px-3 text-sm"
              />
              <SubmitButton
                className="min-h-10 w-full rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-wait disabled:opacity-80"
                pendingLabel="Creando..."
              >
                Crear cuenta
              </SubmitButton>
            </form>
          </>
        )}
      </div>
    </details>
  );
}
