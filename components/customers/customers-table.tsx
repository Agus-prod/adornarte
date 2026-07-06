import Link from "next/link";
import { deleteCustomerFromForm } from "@/app/(dashboard)/clientes/actions";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  credit_enabled: boolean | null;
  credit_limit: number | null;
  current_balance: number | null;
};

export function CustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  if (customers.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
        No hay clientes registrados.
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-sm
      "
    >
      <table className="w-full">
        <thead>
          <tr
            className="
              border-b
              bg-gray-50
              text-sm
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              Teléfono
            </th>

            <th className="p-4 text-left">
              Email
            </th>

            <th className="p-4 text-left">
              Crédito
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map(
            (customer) => (
              <tr
                key={customer.id}
                className="
                  border-b
                  transition-colors
                  hover:bg-pink-50/40
                "
              >
                <td className="p-4 font-medium">
                  {customer.name}
                </td>

                <td className="p-4">
                  {customer.phone ?? "-"}
                </td>

                <td className="p-4">
                  {customer.email ?? "-"}
                </td>

                <td className="p-4">
                  <div className="text-sm">
                    <div
                      className={
                        customer.credit_enabled
                          ? "font-semibold text-pink-600"
                          : "text-gray-500"
                      }
                    >
                      {customer.credit_enabled
                        ? "Activo"
                        : "Inactivo"}
                    </div>
                    <div className="text-gray-500">
                      Saldo L{" "}
                      {Number(
                        customer.current_balance ??
                          0
                      ).toFixed(2)}
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/clientes/${customer.id}`}
                      className="
                        rounded-lg
                        px-3 py-1
                        text-pink-600
                        transition-all
                        hover:bg-pink-100
                      "
                    >
                      Estado
                    </Link>

                    <Link
                      href={`/clientes/${customer.id}/editar`}
                      className="
                        rounded-lg
                        px-3 py-1
                        text-pink-600
                        transition-all
                        hover:bg-pink-100
                      "
                    >
                      Editar
                    </Link>

                    <form
                      action={deleteCustomerFromForm}
                    >
                      <input
                        type="hidden"
                        name="customer_id"
                        value={customer.id}
                      />

                      <button
                        type="submit"
                        className="
                          rounded-lg
                          px-3 py-1
                          text-red-600
                          transition-all
                          hover:bg-red-100
                        "
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
