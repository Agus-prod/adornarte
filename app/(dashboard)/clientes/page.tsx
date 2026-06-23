import Link from "next/link";
import { getCustomers } from "@/lib/customers/get-customers";
import { CustomersTable } from "@/components/customers/customers-table";

export default async function ClientesPage() {
  const customers =
    await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Clientes
          </h1>

          <p className="mt-2 text-gray-500">
            Gestión de clientes.
          </p>
        </div>

        <Link
          href="/clientes/nuevo"
          className="rounded-xl bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          + Nuevo Cliente
        </Link>
      </div>

      <CustomersTable
        customers={customers}
      />
    </div>
  );
}