import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/ventas/print-button";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Sale = {
  id: string;
  invoice_number: string | null;
  total: number;
  created_at: string;
  paid_amount: number | null;
  pending_amount: number | null;
  payment_method: string | null;
  payment_status: string | null;

  customers:
    | {
        name: string;
        phone: string | null;
        email: string | null;
      }
    | null;
};

type SaleItem = {
  id: string;
  quantity: number;
  price: number;
  products:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

type CatalogOrderForSale = {
  order_number: string;
  shipping_address: string;
  shipping_city: string;
  shipping_notes: string | null;
  status: string;
};

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

function formatPaymentMethod(
  method: string | null
) {
  const labels: Record<string, string> = {
    CASH: "Efectivo",
    CARD: "Tarjeta",
    TRANSFER: "Transferencia",
    CREDIT: "Crédito",
  };

  return method
    ? labels[method] ?? method
    : "No registrado";
}

function formatPaymentStatus(
  status: string | null
) {
  const labels: Record<string, string> = {
    PAID: "Pagado",
    PENDING: "Pendiente",
    PARTIAL: "Parcial",
    CANCELLED: "Cancelado",
  };

  return status
    ? labels[status] ?? status
    : "No registrado";
}

function getProductName(
  item: SaleItem
) {
  if (Array.isArray(item.products)) {
    return item.products[0]?.name ?? "-";
  }

  return item.products?.name ?? "-";
}

function isMissingInvoiceColumn(
  error: unknown
) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  const code = error.code;
  const message =
    "message" in error
      ? String(error.message)
      : "";

  return (
    code === "42703" ||
    (code === "PGRST204" &&
      message.includes(
        "invoice_number"
      ))
  );
}

export default async function SaleDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const profile =
    await getCurrentProfile();

  const supabase =
    await createClient();

  let {
    data: saleData,
    error: saleError,
  } = await supabase
    .from("sales")
    .select(`
      id,
      invoice_number,
      total,
      created_at,
      paid_amount,
      pending_amount,
      payment_method,
      payment_status,
      customers (
        name,
        phone,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (isMissingInvoiceColumn(saleError)) {
    const fallback = await supabase
      .from("sales")
      .select(`
        id,
        invoice_number,
        total,
        created_at,
        paid_amount,
        pending_amount,
        payment_method,
        payment_status,
        customers (
          name,
          phone,
          email
        )
      `)
      .eq("id", id)
      .single();

    saleData = fallback.data;
    saleError = fallback.error;
  }

  if (saleError || !saleData) {
    notFound();
  }

  const sale =
    saleData as unknown as Sale;

  const {
    data: items,
  } = await supabase
    .from("sale_items")
    .select(`
      id,
      quantity,
      price,
      products (
        name
      )
    `)
    .eq("sale_id", id);

  const saleItems =
    (items ?? []) as unknown as SaleItem[];

  const {
    data: orderData,
  } = await supabase
    .from("catalog_orders")
    .select(`
      order_number,
      shipping_address,
      shipping_city,
      shipping_notes,
      status
    `)
    .eq("sale_id", id)
    .maybeSingle();
  const catalogOrder =
    orderData as CatalogOrderForSale | null;

  const invoiceNumber =
    sale.invoice_number ??
    sale.id.slice(0, 8).toUpperCase();
  const saleDate =
    sale.created_at
      ? new Date(sale.created_at)
      : new Date();
  const total = Number(sale.total);
  const sellerName =
    profile?.full_name ??
    "Cajero #1";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold">
            Detalle de Venta
          </h1>

          <p className="mt-2 text-gray-500">
            Información completa de la venta.
          </p>
        </div>

        <PrintButton />
      </div>

      <article className="invoice-document print-page print-card mx-auto overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">
        <header className="border-b border-pink-100 bg-white p-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-5">
              <img
                src="/adornarte-logo.jpg"
                alt="AdornArte"
                className="size-24 rounded-full border-4 border-pink-100 object-cover"
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">
                  AdornArte
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
                  Factura
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Resalta tu belleza
                </p>
                <div className="mt-4 text-xs leading-5 text-zinc-500">
                  <p>Gracias por tu compra.</p>
                  <p>Comprobante entregado al cliente.</p>
                </div>
              </div>
            </div>

            <div className="min-w-52 rounded-3xl border border-pink-100 bg-pink-50 p-5 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
                No. Factura
              </p>
              <p className="mt-1 font-mono text-xl font-black text-zinc-950">
                {invoiceNumber}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase text-zinc-500">
                Fecha
              </p>
              <p className="text-sm font-semibold">
                {saleDate.toLocaleDateString()}
              </p>
              <p className="text-sm text-zinc-500">
                {saleDate.toLocaleTimeString()}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase text-zinc-500">
                Total
              </p>
              <p className="text-2xl font-black text-pink-600">
                {formatMoney(total)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 border-b border-pink-100 p-8 md:grid-cols-3">
          <div className="rounded-3xl bg-zinc-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Cliente
            </p>
            <p className="mt-2 text-lg font-black">
              {sale.customers?.name ??
                "Consumidor Final"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Tel:{" "}
              {sale.customers?.phone ??
                "No registrado"}
            </p>
            <p className="text-sm text-zinc-500">
              Email:{" "}
              {sale.customers?.email ??
                "No registrado"}
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Forma de pago
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-lg font-black">
                {formatPaymentMethod(
                  sale.payment_method
                )}
              </p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-700">
                {formatPaymentStatus(
                  sale.payment_status
                )}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Comprobante de venta emitido al cliente.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Vendedor
            </p>
            <p className="mt-2 text-lg font-black">
              {sellerName}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Responsable de venta
            </p>
          </div>
        </section>

        {catalogOrder && (
          <section className="grid gap-5 border-b border-pink-100 p-8 md:grid-cols-[1fr_2fr]">
            <div className="rounded-3xl bg-pink-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                Pedido web
              </p>
              <p className="mt-2 text-lg font-black">
                {catalogOrder.order_number}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Estado: {catalogOrder.status}
              </p>
            </div>

            <div className="rounded-3xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Entrega
              </p>
              <p className="mt-2 font-semibold">
                {catalogOrder.shipping_city}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {catalogOrder.shipping_address}
              </p>
              {catalogOrder.shipping_notes && (
                <p className="mt-2 text-sm text-zinc-500">
                  Notas:{" "}
                  {catalogOrder.shipping_notes}
                </p>
              )}
            </div>
          </section>
        )}

        <section className="p-8">
          {!saleItems.length ? (
            <p className="text-zinc-500">
              No hay productos.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-950 text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="py-3 pr-3">
                    Descripción
                  </th>
                  <th className="px-3 py-3 text-right">
                    Cant.
                  </th>
                  <th className="px-3 py-3 text-right">
                    Precio
                  </th>
                  <th className="py-3 pl-3 text-right">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item) => {
                  const subtotal =
                    item.quantity *
                    Number(item.price);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100"
                    >
                      <td className="py-4 pr-3 font-semibold">
                        {getProductName(item)}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {formatMoney(
                          Number(item.price)
                        )}
                      </td>
                      <td className="py-4 pl-3 text-right font-black text-pink-600">
                        {formatMoney(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_18rem]">
            <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-5 text-sm text-zinc-600">
              <p className="font-bold text-zinc-950">
                Observaciones
              </p>
              <p className="mt-2">
                Esta factura sirve como comprobante de compra.
                Para cambios o consultas, conserva este documento.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Subtotal
                </span>
                <span className="font-semibold">
                  {formatMoney(total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Descuento
                </span>
                <span className="font-semibold">
                  {formatMoney(0)}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-zinc-950 pt-4 text-2xl font-black">
                <span>Total</span>
                <span className="text-pink-600">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-pink-100 px-8 py-5 text-center text-xs text-zinc-500">
          <p className="font-semibold text-zinc-700">
            AdornArte - Resalta tu belleza
          </p>
          <p>
            Gracias por preferirnos. Esta factura fue emitida
            para uso del cliente.
          </p>
        </footer>
      </article>
    </div>
  );
}
