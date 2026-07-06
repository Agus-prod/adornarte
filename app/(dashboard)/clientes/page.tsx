import Link from "next/link";
import { getCustomers } from "@/lib/customers/get-customers";
import { CustomersTable } from "@/components/customers/customers-table";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
  }>;
}) {
  const params =
    await searchParams;
  const customers =
    await getCustomers();
  const hasDeleteHistoryError =
    params?.error ===
    "customer_has_history";

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

      {hasDeleteHistoryError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ese cliente tiene historial de ventas o pagos.
          Para conservar los registros, no se puede
          borrar directamente.
        </div>
      ) : null}

      <CustomersTable
        customers={customers}
      />
    </div>
  );
}
