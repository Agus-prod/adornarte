import Link from "next/link";
import {
  Clock3,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  confirmCatalogTransferPaymentAction,
  convertCatalogOrderToSaleAction,
  markCatalogOrderDeliveredAction,
} from "@/app/(dashboard)/ventas/actions";
import { getCatalogPaymentReceiptSignedUrl } from "@/lib/catalog/services/payment-service";

type Sale = {
  id: string;
  invoice_number: string | null;
  total: number;
  created_at: string;

  customers:
    | {
        name: string;
      }
    | null;
};

type CommerceOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_city: string;
  sale_id: string | null;
  status: string;
  total: number;
  created_at: string;
};

type CommercePaymentReview = {
  id: string;
  order_id: string | null;
  amount: number;
  reference: string | null;
  receipt_image_path: string | null;
  created_at: string;
  paid_at: string | null;
  status: string;
  receiptUrl: string | null;
  catalog_orders:
    | {
        order_number: string;
        customer_name: string;
        customer_phone: string;
        shipping_city: string;
        status: string;
        total: number;
      }
    | null;
};

type SalesPanel =
  | "orders"
  | "transfers"
  | "transfer-history"
  | "sales";

type PageProps = {
  searchParams?: Promise<{
    panel?: string;
  }>;
};

function getPaymentGroupKey(
  payment: CommercePaymentReview
) {
  return (
    payment.order_id ??
    payment.id
  );
}

function dedupePaymentsByOrder(
  payments: CommercePaymentReview[]
) {
  const byOrder = new Map<
    string,
    CommercePaymentReview
  >();

  for (const payment of payments) {
    const key =
      getPaymentGroupKey(payment);
    const current =
      byOrder.get(key);

    if (
      !current ||
      new Date(payment.created_at).getTime() >
        new Date(
          current.created_at
        ).getTime()
    ) {
      byOrder.set(key, payment);
    }
  }

  return [...byOrder.values()];
}

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
  };

  return labels[status] ?? status;
}

function getSelectedPanel(
  panel: string | undefined
): SalesPanel {
  if (
    panel === "orders" ||
    panel === "transfers" ||
    panel === "transfer-history" ||
    panel === "sales"
  ) {
    return panel;
  }

  return "orders";
}

export default async function SalesPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;
  const selectedPanel =
    getSelectedPanel(params?.panel);
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();
  const adminSupabase =
    createAdminClient();

  const [
    salesResult,
    commerceOrdersResult,
    commercePaymentsResult,
    commercePaymentHistoryResult,
  ] = await Promise.all([
    supabase
      .from("sales")
      .select(`
        id,
        invoice_number,
        total,
        created_at,
        customers (
          name
        )
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .order("created_at", {
        ascending: false,
      }),
    adminSupabase
      .from("catalog_orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        shipping_city,
        sale_id,
        status,
        total,
        created_at
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .in("status", [
        "pending",
        "paid",
        "preparing",
        "shipped",
      ])
      .order("created_at", {
        ascending: false,
      }),
    adminSupabase
      .from("catalog_payments")
      .select(`
        id,
        order_id,
        amount,
        reference,
        receipt_image_path,
        paid_at,
        status,
        created_at,
        catalog_orders (
          order_number,
          customer_name,
          customer_phone,
          shipping_city,
          status,
          total
        )
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("method", "transfer")
      .eq("status", "pending")
      .not(
        "receipt_image_path",
        "is",
        null
      )
      .order("created_at", {
        ascending: false,
      }),
    adminSupabase
      .from("catalog_payments")
      .select(`
        id,
        order_id,
        amount,
        reference,
        receipt_image_path,
        paid_at,
        status,
        created_at,
        catalog_orders (
          order_number,
          customer_name,
          customer_phone,
          shipping_city,
          status,
          total
        )
      `)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("method", "transfer")
      .eq("status", "paid")
      .not(
        "receipt_image_path",
        "is",
        null
      )
      .order("paid_at", {
        ascending: false,
      })
      .limit(20),
  ]);

  if (salesResult.error) {
    throw salesResult.error;
  }

  if (commerceOrdersResult.error) {
    throw commerceOrdersResult.error;
  }

  if (commercePaymentsResult.error) {
    throw commercePaymentsResult.error;
  }

  if (commercePaymentHistoryResult.error) {
    throw commercePaymentHistoryResult.error;
  }

  const sales = (salesResult.data ?? []).map(
    (sale) => ({
      ...sale,
      created_at:
        sale.created_at ?? "",
    })
  ) as Sale[];
  const commerceOrders =
    (commerceOrdersResult.data ??
      []) as CommerceOrder[];
  const commerceOrdersToConvert =
    commerceOrders.filter(
      (order) => !order.sale_id
    );
  const commerceOrdersInProgress =
    commerceOrders.filter(
      (order) => order.sale_id
    );
  const commercePayments =
    dedupePaymentsByOrder(
      await Promise.all(
      (
        (commercePaymentsResult.data ??
          []) as Omit<
          CommercePaymentReview,
          "receiptUrl"
        >[]
      ).map(async (payment) => ({
        ...payment,
        receiptUrl:
          payment.receipt_image_path
            ? await getCatalogPaymentReceiptSignedUrl(
                payment.receipt_image_path
              )
            : null,
      }))
      )
    );
  const commercePaymentHistory =
    dedupePaymentsByOrder(
      await Promise.all(
      (
        (commercePaymentHistoryResult.data ??
          []) as Omit<
          CommercePaymentReview,
          "receiptUrl"
        >[]
      ).map(async (payment) => ({
        ...payment,
        receiptUrl:
          payment.receipt_image_path
            ? await getCatalogPaymentReceiptSignedUrl(
                payment.receipt_image_path
              )
            : null,
      }))
      )
    );
  const commerceTotal =
    commerceOrders.reduce(
      (total, order) =>
        total + Number(order.total),
      0
    );
  const transferTotal =
    commercePayments.reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );
  const salesTotal = sales.reduce(
    (total, sale) =>
      total + Number(sale.total),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Ventas
        </h1>

        <p className="mt-2 text-gray-500">
          Historial de ventas realizadas.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Pedidos activos",
            value: commerceOrders.length,
            detail: formatMoney(commerceTotal),
            icon: PackageCheck,
            href: "/ventas?panel=orders",
            panel: "orders",
          },
          {
            label: "Por convertir",
            value: commerceOrdersToConvert.length,
            detail: "Requieren venta",
            icon: Clock3,
            href: "/ventas?panel=orders",
            panel: "orders",
          },
          {
            label: "Transferencias",
            value: commercePayments.length,
            detail: formatMoney(transferTotal),
            icon: ShieldCheck,
            href: "/ventas?panel=transfers",
            panel: "transfers",
          },
          {
            label: "Ventas",
            value: sales.length,
            detail: formatMoney(salesTotal),
            icon: ReceiptText,
            href: "/ventas?panel=sales",
            panel: "sales",
          },
        ].map((item) => {
          const Icon = item.icon;
          const isActive =
            selectedPanel === item.panel;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? "rounded-3xl border border-pink-200 bg-pink-50 p-5 shadow-sm"
                  : "rounded-3xl border border-white/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-100 hover:shadow-md"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {item.value}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-500">
                {item.detail}
              </p>
            </Link>
          );
        })}
      </section>

      {selectedPanel === "orders" && (
      <section
        className="
          rounded-3xl
          border
          border-pink-100
          bg-pink-50/80
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Pedidos Commerce
            </h2>
            <p className="text-sm text-pink-700">
              Pedidos web por vender, preparar o entregar.
            </p>
          </div>
          <span className="text-sm font-semibold text-pink-700">
            {commerceOrdersToConvert.length} por convertir
            {commerceOrdersInProgress.length
              ? ` / ${commerceOrdersInProgress.length} en preparacion`
              : ""}
          </span>
        </div>

        {!commerceOrders.length ? (
          <p className="mt-5 text-sm text-gray-500">
            No hay pedidos pendientes de Commerce.
          </p>
        ) : (
          <div className="mt-5 grid gap-3">
            {commerceOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 rounded-2xl bg-white p-4 text-sm shadow-sm md:grid-cols-[1fr_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold">
                    {order.order_number} - {order.customer_name}
                  </p>
                  <p className="text-gray-500">
                    {order.customer_phone} / {order.shipping_city}
                  </p>
                  <Link
                    href={`/catalogo/pedidos/${order.id}`}
                    className="mt-2 inline-flex text-xs font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Ver pedido
                  </Link>
                </div>
                <span className="rounded-full bg-pink-100 px-3 py-1 text-center font-semibold text-pink-700">
                  {order.status}
                </span>
                <span className="text-right text-lg font-bold text-pink-600">
                  L {Number(order.total).toFixed(2)}
                </span>
                {order.sale_id ? (
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                    <Link
                      href={`/ventas/${order.sale_id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-pink-200 px-4 text-sm font-semibold text-pink-700 hover:bg-pink-50"
                    >
                      Ver venta
                    </Link>
                    <form
                      action={markCatalogOrderDeliveredAction.bind(
                        null,
                        order.id
                      )}
                    >
                      <button
                        type="submit"
                        className="min-h-10 w-full rounded-xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
                      >
                        Marcar entregado
                      </button>
                    </form>
                  </div>
                ) : (
                  <form
                    action={convertCatalogOrderToSaleAction.bind(
                      null,
                      order.id
                    )}
                  >
                    <button
                      type="submit"
                      className="min-h-10 rounded-xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
                    >
                      Convertir a venta
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {selectedPanel === "transfers" && (
      <section
        className="
          rounded-3xl
          border
          border-zinc-100
          bg-white/90
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Transferencias por revisar
            </h2>
            <p className="text-sm text-gray-500">
              Comprobantes enviados desde el checkout del catalogo.
            </p>
          </div>
          <span className="text-sm font-semibold text-pink-700">
            {commercePayments.length} pendientes
          </span>
        </div>

        {!commercePayments.length ? (
          <p className="mt-5 text-sm text-gray-500">
            No hay transferencias pendientes de revision.
          </p>
        ) : (
          <div className="mt-5 grid gap-3">
            {commercePayments.map((payment) => (
              <div
                key={payment.id}
                className="grid gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm lg:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-semibold">
                    {payment.catalog_orders
                      ?.order_number ??
                      "Pedido sin confirmar"}
                    {" - "}
                    {payment.catalog_orders
                      ?.customer_name ??
                      "Cliente no disponible"}
                  </p>
                  <p className="text-gray-500">
                    Tel:{" "}
                    {payment.catalog_orders
                      ?.customer_phone ??
                      "No registrado"}
                    {" / "}
                    Ciudad:{" "}
                    {payment.catalog_orders
                      ?.shipping_city ??
                      "No registrada"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Referencia:{" "}
                    {payment.reference ??
                      "Sin referencia"}{" "}
                    - Estado pedido:{" "}
                    {payment.catalog_orders?.status ??
                      "N/A"}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <span className="text-lg font-bold text-pink-600">
                    L{" "}
                    {Number(
                      payment.catalog_orders
                        ?.total ??
                        payment.amount
                    ).toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">
                    Comprobante: L{" "}
                    {Number(payment.amount).toFixed(2)}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {payment.receiptUrl ? (
                    <a
                      href={payment.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                      Ver comprobante
                    </a>
                  ) : (
                    <span className="inline-flex min-h-10 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-500">
                      Sin captura
                    </span>
                  )}
                  <form
                    action={confirmCatalogTransferPaymentAction.bind(
                      null,
                      payment.id
                    )}
                  >
                    <button
                      type="submit"
                      className="min-h-10 w-full rounded-xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
                    >
                      Confirmar y preparar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {selectedPanel === "transfer-history" && (
      <section
        className="
          rounded-3xl
          border
          border-zinc-100
          bg-white/90
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Historial de transferencias
            </h2>
            <p className="text-sm text-gray-500">
              Comprobantes confirmados desde el catalogo.
            </p>
          </div>
          <span className="text-sm font-semibold text-emerald-700">
            {commercePaymentHistory.length} confirmadas
          </span>
        </div>

        {!commercePaymentHistory.length ? (
          <p className="mt-5 text-sm text-gray-500">
            Todavia no hay transferencias confirmadas.
          </p>
        ) : (
          <div className="mt-5 grid gap-3">
            {commercePaymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm lg:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-semibold">
                    {payment.catalog_orders
                      ?.order_number ??
                      "Pedido sin confirmar"}
                    {" - "}
                    {payment.catalog_orders
                      ?.customer_name ??
                      "Cliente no disponible"}
                  </p>
                  <p className="text-gray-500">
                    Tel:{" "}
                    {payment.catalog_orders
                      ?.customer_phone ??
                      "No registrado"}
                    {" / "}
                    Ciudad:{" "}
                    {payment.catalog_orders
                      ?.shipping_city ??
                      "No registrada"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Referencia:{" "}
                    {payment.reference ??
                      "Sin referencia"}{" "}
                    - Estado pedido:{" "}
                    {payment.catalog_orders?.status ??
                      "N/A"}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    Confirmada{" "}
                    {payment.paid_at
                      ? new Date(
                          payment.paid_at
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <span className="text-lg font-bold text-emerald-700">
                    L{" "}
                    {Number(
                      payment.catalog_orders
                        ?.total ??
                        payment.amount
                    ).toFixed(2)}
                  </span>
                  <p className="text-xs text-emerald-700/80">
                    Comprobante: L{" "}
                    {Number(payment.amount).toFixed(2)}
                  </p>
                </div>
                {payment.receiptUrl ? (
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    Ver comprobante
                  </a>
                ) : (
                  <span className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700">
                    Sin captura
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {selectedPanel === "sales" && (
      <section
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/80
          p-6
          shadow-sm
          backdrop-blur-xl
        "
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Ventas registradas
            </h2>
            <p className="text-sm text-gray-500">
              Facturas y ventas convertidas desde POS o Commerce.
            </p>
          </div>
          <span className="text-sm font-semibold text-pink-700">
            {sales.length} ventas
          </span>
        </div>

        {!sales.length ? (
          <p className="mt-5 text-gray-500">
            No hay ventas registradas.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {sales.map((sale) => (
              <Link
                key={sale.id}
                href={`/ventas/${sale.id}`}
                className="
                  block
                  rounded-2xl
                  bg-gray-50
                  p-4
                  transition-all
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Factura{" "}
                      {sale.invoice_number ??
                        sale.id
                          .slice(0, 8)
                          .toUpperCase()}
                      {" - "}
                      {sale.customers?.name ??
                        "Consumidor Final"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        sale.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-pink-600">
                      L{" "}
                      {Number(
                        sale.total
                      ).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-pink-500">
                      Ver detalle →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      )}
    </div>
  );
}
