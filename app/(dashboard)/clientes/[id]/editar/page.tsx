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