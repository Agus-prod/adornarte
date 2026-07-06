import Link from "next/link";
import { registerCustomerPaymentAction } from "@/app/(dashboard)/clientes/actions";
import { CustomerStatementActions } from "@/components/customers/customer-statement-actions";
import { getCustomerStatement } from "@/lib/customers/get-customer-statement";

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    customer,
    rows,
    balance,
    unpaidInvoices,
  } =
    await getCustomerStatement(id);
  const canRegisterPayment =
    balance > 0 &&
    unpaidInvoices.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estado de cuenta
          </h1>
          <p className="mt-2 text-gray-500">
            Crédito, movimientos y recordatorios del cliente.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/clientes/${customer.id}/editar`}
            className="inline-flex min-h-10 items-center rounded-2xl border px-4 text-sm font-semibold hover:bg-gray-50"
          >
            Editar cliente
          </Link>
          <Link
            href="/clientes"
            className="inline-flex min-h-10 items-center rounded-2xl border px-4 text-sm font-semibold hover:bg-gray-50"
          >
            Volver
          </Link>
        </div>
      </div>

      <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm print:border-none print:shadow-none">
        <div className="flex flex-col gap-5 border-b border-pink-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-full border-4 border-pink-100 bg-pink-50 text-center text-xs font-black uppercase text-pink-700">
              AdornArte
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-pink-600">
                Resalta tu belleza
              </p>
              <h2 className="text-2xl font-bold">
                {customer.name}
              </h2>
              <p className="text-sm text-gray-500">
                {customer.phone ?? "Sin telefono"} /{" "}
                {customer.email ?? "Sin email"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-pink-50 p-5 text-right">
            <p className="text-sm font-semibold text-pink-700">
              Saldo pendiente
            </p>
            <p className="mt-1 text-3xl font-black text-pink-600">
              {formatMoney(balance)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Límite:{" "}
              {formatMoney(
                Number(
                  customer.credit_limit ?? 0
                )
              )}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <CustomerStatementActions
            customerName={customer.name}
            phone={customer.phone}
            balance={balance}
          />
        </div>

        <form
          action={registerCustomerPaymentAction.bind(
            null,
            customer.id
          )}
          className="mt-6 grid gap-3 rounded-3xl border border-pink-100 bg-pink-50/60 p-4 print:hidden md:grid-cols-[2fr_1fr_1fr_2fr_auto]"
        >
          <select
            name="sale_id"
            required
            disabled={!canRegisterPayment}
            className="min-h-11 rounded-2xl border bg-white px-3 text-sm disabled:bg-zinc-100"
            defaultValue=""
          >
            <option value="" disabled>
              Seleccionar factura
            </option>
            {unpaidInvoices.map((invoice) => (
              <option
                key={invoice.id}
                value={invoice.id}
              >
                {invoice.label}
              </option>
            ))}
          </select>
          <input
            name="amount"
            type="number"
            min="0.01"
            max={Math.max(balance, 0)}
            step="0.01"
            required
            disabled={!canRegisterPayment}
            placeholder={
              canRegisterPayment
                ? "Monto del abono"
                : "Sin saldo pendiente"
            }
            className="min-h-11 rounded-2xl border bg-white px-3 text-sm disabled:bg-zinc-100"
          />
          <select
            name="payment_method"
            disabled={!canRegisterPayment}
            className="min-h-11 rounded-2xl border bg-white px-3 text-sm disabled:bg-zinc-100"
            defaultValue="CASH"
          >
            <option value="CASH">
              Efectivo
            </option>
            <option value="TRANSFER">
              Transferencia
            </option>
            <option value="CARD">
              Tarjeta
            </option>
          </select>
          <input
            name="notes"
            disabled={!canRegisterPayment}
            placeholder="Referencia o nota"
            className="min-h-11 rounded-2xl border bg-white px-3 text-sm disabled:bg-zinc-100"
          />
          <button
            type="submit"
            disabled={!canRegisterPayment}
            className="min-h-11 rounded-2xl bg-pink-600 px-5 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {canRegisterPayment
              ? "Registrar abono"
              : "Saldo liquidado"}
          </button>
        </form>

        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">
                  Fecha
                </th>
                <th className="p-4">
                  Movimiento
                </th>
                <th className="p-4">
                  Factura
                </th>
                <th className="p-4">
                  Estado
                </th>
                <th className="p-4 text-right">
                  Cargo
                </th>
                <th className="p-4 text-right">
                  Abono
                </th>
                <th className="p-4 text-right">
                  Saldo factura
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {row.date
                        ? new Date(
                            row.date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 font-medium">
                      {row.description}
                    </td>
                    <td className="p-4">
                      {row.invoiceLabel ?? "-"}
                    </td>
                    <td className="p-4">
                      {row.status ? (
                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                          {row.status}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 text-right text-pink-600">
                      {row.charge
                        ? formatMoney(row.charge)
                        : "-"}
                    </td>
                    <td className="p-4 text-right">
                      {row.payment
                        ? formatMoney(row.payment)
                        : "-"}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {row.invoiceId
                        ? formatMoney(row.balance)
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-500"
                  >
                    Aun no hay movimientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
