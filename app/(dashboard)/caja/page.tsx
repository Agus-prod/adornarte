import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  openCashRegister,
  closeCashRegister,
} from "./actions";

type CashRegister = {
  id: string;
  opening_amount: number;
  expected_amount: number;
  counted_amount: number;
  difference: number;
  notes: string | null;
  created_at: string;
  is_closed: boolean;
  closed_at: string | null;
};

export default async function CajaPage() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const {
    data: sales,
  } = await supabase
    .from("sales")
    .select("total")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .gte(
      "created_at",
      startOfDay.toISOString()
    );

  const salesToday =
    sales?.reduce(
      (sum, sale) =>
        sum +
        Number(sale.total ?? 0),
      0
    ) ?? 0;

  const {
    data: todayCashData,
  } = await supabase
    .from("cash_closings")
    .select("*")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .gte(
      "created_at",
      startOfDay.toISOString()
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(1);

  const todayCash =
    todayCashData?.[0];

  const {
    data: historyData,
  } = await supabase
    .from("cash_closings")
    .select("*")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(20);

  const history =
    (historyData ??
      []) as CashRegister[];

  const cashOpen =
    todayCash &&
    !todayCash.is_closed;

  const expectedAmount =
    cashOpen
      ? Number(
          todayCash.opening_amount
        ) + salesToday
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Caja
        </h1>

        <p className="mt-2 text-gray-500">
          Apertura y cierre diario.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Ventas del Día
          </p>

          <p className="mt-2 text-3xl font-bold text-pink-600">
            L {salesToday.toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Estado
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              cashOpen
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {cashOpen
              ? "Abierta"
              : "Cerrada"}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Efectivo Esperado
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            L{" "}
            {expectedAmount.toFixed(
              2
            )}
          </p>
        </div>
      </div>

      {!todayCash ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">
            Apertura de Caja
          </h2>

          <form
            action={
              openCashRegister
            }
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block">
                Efectivo Inicial
              </label>

              <input
                type="number"
                step="0.01"
                name="opening_amount"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 text-white"
            >
              Abrir Caja
            </button>
          </form>
        </div>
      ) : cashOpen ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">
            Cierre de Caja
          </h2>

          <form
            action={
              closeCashRegister
            }
            className="space-y-4"
          >
            <input
              type="hidden"
              name="cash_id"
              value={todayCash.id}
            />

            <input
              type="hidden"
              name="opening_amount"
              value={
                todayCash.opening_amount
              }
            />

            <input
              type="hidden"
              name="expected_amount"
              value={
                expectedAmount
              }
            />

            <div>
              <label className="mb-2 block">
                Efectivo Contado
              </label>

              <input
                type="number"
                step="0.01"
                name="counted_amount"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">
                Observaciones
              </label>

              <textarea
                name="notes"
                rows={4}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-pink-600 px-6 py-3 text-white"
            >
              Cerrar Caja
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-3xl border bg-green-50 p-6">
          <h2 className="text-xl font-bold text-green-700">
            Caja cerrada correctamente
          </h2>
        </div>
      )}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">
          Historial
        </h2>

        {!history.length ? (
          <p className="text-gray-500">
            No hay registros.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map(
              (item) => (
                <Link
                  key={item.id}
                  href={`/caja/${item.id}`}
                  className="
                    block
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    hover:bg-pink-50
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        Diferencia: L{" "}
                        {Number(
                          item.difference
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          item.is_closed
                            ? "font-bold text-green-600"
                            : "font-bold text-orange-600"
                        }
                      >
                        {item.is_closed
                          ? "Cerrada"
                          : "Abierta"}
                      </p>

                      <p className="mt-1 text-xs text-pink-500">
                        Ver detalle →
                      </p>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}