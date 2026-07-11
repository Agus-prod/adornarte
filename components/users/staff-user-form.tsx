"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createStaffUser,
  type CreateUserState,
} from "@/app/(dashboard)/configuracion/perfiles/actions";

const initialState: CreateUserState = {
  status: "idle",
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 w-full rounded-xl bg-pink-500 px-4 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
    >
      {pending
        ? "Creando usuario..."
        : "Crear usuario"}
    </button>
  );
}

export function StaffUserForm() {
  const [state, action] = useActionState(
    createStaffUser,
    initialState
  );

  return (
    <form
      action={action}
      className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div>
        <p className="text-xs font-semibold uppercase text-pink-600">
          Nuevo usuario
        </p>
        <h2 className="mt-1 text-xl font-bold">
          Crear acceso al sistema
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Define el rol antes de entregar la cuenta.
        </p>
      </div>

      {state.message ? (
        <div
          className={
            state.status === "success"
              ? "mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
              : "mt-4 rounded-2xl border border-pink-100 bg-pink-50 p-3 text-sm font-semibold text-pink-700"
          }
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-zinc-700">
          Nombre
          <input
            name="full_name"
            required
            placeholder="Nombre del usuario"
            className="min-h-11 rounded-xl border border-zinc-200 px-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-zinc-700">
          Correo
          <input
            name="email"
            type="email"
            required
            placeholder="correo@empresa.com"
            className="min-h-11 rounded-xl border border-zinc-200 px-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-zinc-700">
          Contraseña temporal
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Minimo 8 caracteres"
            className="min-h-11 rounded-xl border border-zinc-200 px-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-zinc-700">
          Rol
          <select
            name="role"
            required
            defaultValue="vendedor"
            className="min-h-11 rounded-xl border border-zinc-200 px-3 text-base font-normal"
          >
            <option value="admin">
              Administrador
            </option>
            <option value="caja">
              Caja
            </option>
            <option value="inventario">
              Inventario
            </option>
            <option value="vendedor">
              Vendedor
            </option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
