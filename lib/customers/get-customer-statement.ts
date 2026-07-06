import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export type CustomerStatementRow = {
  id: string;
  date: string;
  description: string;
  invoiceId: string | null;
  invoiceLabel: string | null;
  status: string | null;
  charge: number;
  payment: number;
  balance: number;
};

export type CustomerCreditInvoice = {
  id: string;
  label: string;
  date: string;
  total: number;
  paid: number;
  balance: number;
  status: string | null;
};

export async function getCustomerStatement(
  customerId: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const supabase =
    await createClient();
  const [
    customerResult,
    salesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single(),
    supabase
      .from("sales")
      .select(
        "id, total, paid_amount, pending_amount, payment_method, payment_status, created_at"
      )
      .eq("customer_id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("payment_method", "CREDIT")
      .order("created_at"),
    supabase
      .from("customer_payments")
      .select(
        "id, sale_id, amount, created_at, notes"
      )
      .eq("customer_id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .order("created_at"),
  ]);

  if (customerResult.error) {
    throw customerResult.error;
  }

  if (salesResult.error) {
    throw salesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const saleRows: CustomerStatementRow[] =
    (salesResult.data ?? []).map(
      (sale) => {
        const total = Number(
          sale.total ?? 0
        );
        const paid = Number(
          sale.paid_amount ?? 0
        );
        const balance = Number(
          sale.pending_amount ??
            total - paid
        );

        return {
          id: `sale-${sale.id}`,
          date: sale.created_at ?? "",
          description: `Factura ${sale.id.slice(0, 8)}`,
          invoiceId: sale.id,
          invoiceLabel: sale.id.slice(0, 8),
          status:
            sale.payment_status ??
            "PENDING",
          charge: total,
          payment: 0,
          balance,
        };
      }
    );
  const saleLabels = new Map(
    (salesResult.data ?? []).map((sale) => [
      sale.id,
      sale.id.slice(0, 8),
    ])
  );
  const paymentRows: CustomerStatementRow[] =
    (paymentsResult.data ?? []).map(
      (payment) => ({
        id: `payment-${payment.id}`,
        date: payment.created_at ?? "",
        description: payment.sale_id
          ? `Abono a factura ${saleLabels.get(payment.sale_id) ?? payment.sale_id.slice(0, 8)}`
          : "Abono sin factura",
        invoiceId: payment.sale_id,
        invoiceLabel: payment.sale_id
          ? saleLabels.get(payment.sale_id) ??
            payment.sale_id.slice(0, 8)
          : null,
        status: null,
        charge: 0,
        payment: Number(
          payment.amount ?? 0
        ),
        balance: 0,
      })
    );
  const rows = [
    ...saleRows,
    ...paymentRows,
  ].sort(
    (left, right) =>
      new Date(left.date).getTime() -
      new Date(right.date).getTime()
  );
  const balance = rows.reduce(
    (total, row) =>
      total + row.charge - row.payment,
    0
  );
  const unpaidInvoices: CustomerCreditInvoice[] =
    (salesResult.data ?? [])
      .map((sale) => {
        const total = Number(
          sale.total ?? 0
        );
        const paid = Number(
          sale.paid_amount ?? 0
        );
        const invoiceBalance = Number(
          sale.pending_amount ??
            total - paid
        );

        return {
          id: sale.id,
          label: `Factura ${sale.id.slice(0, 8)} - ${new Date(sale.created_at ?? "").toLocaleDateString()} - Saldo L ${invoiceBalance.toFixed(2)}`,
          date: sale.created_at ?? "",
          total,
          paid,
          balance: invoiceBalance,
          status:
            sale.payment_status ??
            "PENDING",
        };
      })
      .filter(
        (invoice) =>
          invoice.balance > 0
      );

  return {
    customer: customerResult.data,
    rows,
    balance,
    unpaidInvoices,
  };
}
