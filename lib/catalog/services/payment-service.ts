import {
  createPayment,
  getCartPayments,
} from "@/lib/catalog/repositories/payment-repository";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import type { CatalogPaymentMethod } from "@/lib/catalog/types";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function isPaymentMethod(
  value: string
): value is CatalogPaymentMethod {
  return [
    "stripe",
    "paypal",
    "transfer",
    "cash_on_delivery",
  ].includes(value);
}

export async function getCurrentCartPayments() {
  const cart = await getCartDetail();

  if (!cart) {
    return [];
  }

  return getCartPayments(
    cart.cart.id,
    cart.cart.organization_id
  );
}

export async function registerCheckoutPayment(
  formData: FormData
) {
  const cart = await getCartDetail();

  if (!cart || cart.items.length === 0) {
    throw new Error(
      "Carrito vacio."
    );
  }

  const methodValue =
    readText(formData, "method") ||
    cart.cart.payment_method ||
    "cash_on_delivery";

  if (!isPaymentMethod(methodValue)) {
    throw new Error(
      "Metodo de pago no valido."
    );
  }

  const isDeferred =
    methodValue === "cash_on_delivery" ||
    methodValue === "transfer";

  return createPayment({
    organization_id:
      cart.cart.organization_id,
    cart_id: cart.cart.id,
    method: methodValue,
    provider: methodValue,
    status: isDeferred
      ? "pending"
      : "paid",
    amount: cart.totals.total,
    reference:
      readText(formData, "reference") ||
      null,
    notes:
      readText(formData, "notes") || null,
    paid_at: isDeferred
      ? null
      : new Date().toISOString(),
  });
}
