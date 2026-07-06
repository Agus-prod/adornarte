import { getCustomerById } from "@/lib/customers/get-customer-by-id";
import { updateCustomer } from "@/app/(dashboard)/clientes/actions";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer =
    await getCustomerById(id);

  async function updateAction(
    formData: FormData
  ) {
    "use server";

    await updateCustomer(
      id,
      formData
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">
        Editar Cliente
      </h1>

      <form
        action={updateAction}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block">
            Nombre
          </label>

          <input
            name="name"
            required
            defaultValue={customer.name}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Teléfono
          </label>

          <input
            name="phone"
            defaultValue={
              customer.phone ?? ""
            }
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
            defaultValue={
              customer.email ?? ""
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="rounded-3xl border border-pink-100 bg-pink-50/50 p-5">
          <label className="flex items-center gap-3 font-semibold">
            <input
              type="checkbox"
              name="credit_enabled"
              defaultChecked={
                customer.credit_enabled ??
                false
              }
            />
            Crédito activo
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block">
              Límite de crédito
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              name="credit_limit"
              defaultValue={
                customer.credit_limit ?? 0
              }
              className="w-full rounded-xl border p-3"
            />
          </label>

          <p className="mt-3 text-sm text-gray-500">
            Saldo actual: L{" "}
            {Number(
              customer.current_balance ?? 0
            ).toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
