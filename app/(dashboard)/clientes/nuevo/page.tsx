import { createCustomer } from "../actions";

export default function NuevoClientePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">
        Nuevo Cliente
      </h1>

      <form
        action={createCustomer}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block">
            Nombre
          </label>

          <input
            name="name"
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Teléfono
          </label>

          <input
            name="phone"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Email
          </label>

          <input
            type="email"
            name="email"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}