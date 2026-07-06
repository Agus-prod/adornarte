import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createAdminClient } from "@/lib/supabase/admin";

type RegisterCustomerPaymentInput = {
  customerId: string;
  saleId: string;
  amount: number;
  paymentMethod: string;
  notes: string | null;
};

export async function registerCustomerPayment({
  customerId,
  saleId,
  amount,
  paymentMethod,
  notes,
}: RegisterCustomerPaymentInput) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "El abono debe ser mayor que cero."
    );
  }

  if (!saleId) {
    throw new Error(
      "Selecciona la factura que recibira el abono."
    );
  }

  const supabase = createAdminClient();
  const [
    customerResult,
    saleResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("current_balance")
      .eq("id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single(),
    supabase
      .from("sales")
      .select(
        "id, total, paid_amount, pending_amount, payment_status"
      )
      .eq("id", saleId)
      .eq("customer_id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single(),
  ]);

  if (customerResult.error) {
    throw customerResult.error;
  }

  if (saleResult.error) {
    throw saleResult.error;
  }

  const currentBalance = Number(
    customerResult.data.current_balance ??
      0
  );
  const saleTotal = Number(
    saleResult.data.total ?? 0
  );
  const salePaid = Number(
    saleResult.data.paid_amount ?? 0
  );
  const saleBalance = Number(
    saleResult.data.pending_amount ??
      saleTotal - salePaid
  );

  if (currentBalance <= 0) {
    throw new Error(
      "Este cliente no tiene saldo pendiente."
    );
  }

  if (saleBalance <= 0) {
    throw new Error(
      "Esta factura ya esta liquidada."
    );
  }

  if (amount > currentBalance) {
    throw new Error(
      "El abono no puede ser mayor que el saldo pendiente del cliente."
    );
  }

  if (amount > saleBalance) {
    throw new Error(
      "El abono no puede ser mayor que el saldo pendiente de la factura."
    );
  }

  const newSalePaid =
    salePaid + amount;
  const newSaleBalance =
    saleBalance - amount;
  const newBalance =
    currentBalance - amount;

  const { error: paymentError } =
    await supabase
      .from("customer_payments")
      .insert({
        organization_id:
          profile.organization_id,
        customer_id: customerId,
        sale_id: saleId,
        amount,
        payment_method: paymentMethod,
        notes,
        created_by: profile.id,
      });

  if (paymentError) {
    throw paymentError;
  }

  const timestamp =
    new Date().toISOString();
  const [
    saleUpdateResult,
    customerUpdateResult,
  ] = await Promise.all([
    supabase
      .from("sales")
      .update({
        paid_amount: newSalePaid,
        pending_amount: newSaleBalance,
        payment_status:
          newSaleBalance <= 0
            ? "PAID"
            : "PARTIAL",
        updated_at: timestamp,
      })
      .eq("id", saleId)
      .eq(
        "organization_id",
        profile.organization_id
      ),
    supabase
      .from("customers")
      .update({
        current_balance: newBalance,
        last_payment_at: timestamp,
        updated_at: timestamp,
      })
      .eq("id", customerId)
      .eq(
        "organization_id",
        profile.organization_id
      ),
  ]);

  if (saleUpdateResult.error) {
    throw saleUpdateResult.error;
  }

  if (customerUpdateResult.error) {
    throw customerUpdateResult.error;
  }
}
