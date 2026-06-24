import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CashClosing = {
  id: string;
  opening_amount: number;
  expected_amount: number;
  counted_amount: number;
  difference: number;
  notes: string | null;
  created_at: string;
  start_at: string | null;
  closed_at: string | null;
  is_closed: boolean;
  opened_by: string | null;
  closed_by: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
};

type Sale = {
  id: string;
  total: number;
  created_at: string;
};

export default async function CashDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const {
    data: cashData,
    error: cashError,
  } = await supabase
    .from("cash_closings")
    .select("*")
    .eq("id", id)
    .single();

  if (
    cashError ||
    !cashData
  ) {
    notFound();
  }

  const cash =
    cashData as CashClosing;

  let openedByName =
    "No registrado";

  let closedByName =
    "No registrado";

  if (cash.opened_by) {
    const {
      data: openedBy,
    } = await supabase
      .from("profiles")
      .select(
        "id, full_name"
      )
      .eq(
        "id",
        cash.opened_by
      )
      .single();

    openedByName =
      (
        openedBy as Profile | null
      )?.full_name ??
      "No registrado";
  }

  if (cash.closed_by) {
    const {
      data: closedBy,
    } = await supabase
      .from("profiles")
      .select(
        "id, full_name"
      )
      .eq(
        "id",
        cash.closed_by
      )
      .single();

    closedByName =
      (
        closedBy as Profile | null
      )?.full_name ??
      "No registrado";
  }

  let sales: Sale[] = [];

  if (
    cash.start_at &&
    cash.closed_at
  ) {
    const {
      data: salesData,
    } = await supabase
      .from("sales")
      .select(`
        id,
        total,
        created_at
      `)
      .gte(
        "created_at",
        cash.start_at
      )
      .lte(
        "created_at",
        cash.closed_at
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    sales =
      (salesData ??
        []) as Sale[];
  }

  const salesTotal =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total ?? 0
        ),
      0
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Detalle de Caja
          </h1>

          <p className="mt-2 text-gray-500">
            Información completa
            del cierre.
          </p>
        </div>

        <Link
          href="/caja"
          className="
            rounded-xl
            border
            px-4
            py-2
            hover:bg-gray-50
          "
        >
          Volver
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Apertura
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            L{" "}
            {Number(
              cash.opening_amount
            ).toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Esperado
          </p>

          <p className="mt-2 text-3xl font-bold text-pink-600">
            L{" "}
            {Number(
              cash.expected_amount
            ).toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Contado
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            L{" "}
            {Number(
              cash.counted_amount
            ).toFixed(2)}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Diferencia
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              Number(
                cash.difference
              ) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            L{" "}
            {Number(
              cash.difference
            ).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Información General
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Estado</span>

            <span
              className={
                cash.is_closed
                  ? "font-semibold text-green-600"
                  : "font-semibold text-orange-600"
              }
            >
              {cash.is_closed
                ? "Cerrada"
                : "Abierta"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Abrió</span>

            <span>
              {
                openedByName
              }
            </span>
          </div>

          <div className="flex justify-between">
            <span>Cerró</span>

            <span>
              {
                closedByName
              }
            </span>
          </div>

          <div className="flex justify-between">
            <span>Inicio</span>

            <span>
              {cash.start_at
                ? new Date(
                    cash.start_at
                  ).toLocaleString()
                : "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Fin</span>

            <span>
              {cash.closed_at
                ? new Date(
                    cash.closed_at
                  ).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Observaciones
        </h2>

        <p className="text-gray-600">
          {cash.notes?.trim()
            ? cash.notes
            : "Sin observaciones."}
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Ventas Incluidas
          </h2>

          <span className="font-semibold text-pink-600">
            L{" "}
            {salesTotal.toFixed(
              2
            )}
          </span>
        </div>

        {!sales.length ? (
          <p className="text-gray-500">
            No hay ventas asociadas.
          </p>
        ) : (
          <div className="space-y-3">
            {sales.map(
              (sale) => (
                <Link
                  key={sale.id}
                  href={`/ventas/${sale.id}`}
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
                        Venta
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          sale.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="font-bold text-pink-600">
                      L{" "}
                      {Number(
                        sale.total
                      ).toFixed(2)}
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