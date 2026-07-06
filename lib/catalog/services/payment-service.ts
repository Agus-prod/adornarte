import {
  createPayment,
  getCartPayments,
  updatePayment,
} from "@/lib/catalog/repositories/payment-repository";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import type { CatalogPaymentMethod } from "@/lib/catalog/types";
import { createAdminClient } from "@/lib/supabase/admin";

const receiptBucket =
  "catalog-payment-receipts";

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

function getSafeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

async function uploadReceiptImage(
  formData: FormData,
  organizationId: string,
  cartId: string
) {
  const value =
    formData.get("receipt_image");

  if (
    !(value instanceof File) ||
    value.size === 0
  ) {
    return null;
  }

  if (!value.type.startsWith("image/")) {
    throw new Error(
      "El comprobante debe ser una imagen."
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (value.size > maxSize) {
    throw new Error(
      "El comprobante no puede superar 5 MB."
    );
  }

  const supabase =
    createAdminClient();
  const path = [
    organizationId,
    cartId,
    `${crypto.randomUUID()}-${getSafeFileName(value.name)}`,
  ].join("/");
  const { error } = await supabase.storage
    .from(receiptBucket)
    .upload(path, value, {
      contentType: value.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return path;
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

export async function getCatalogPaymentReceiptSignedUrl(
  path: string
) {
  const supabase =
    createAdminClient();
  const { data, error } =
    await supabase.storage
      .from(receiptBucket)
      .createSignedUrl(path, 60 * 10);

  if (error) {
    throw error;
  }

  return data.signedUrl;
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
  const receiptImagePath =
    methodValue === "transfer"
      ? await uploadReceiptImage(
          formData,
          cart.cart.organization_id,
          cart.cart.id
        )
      : null;

  if (
    methodValue === "transfer" &&
    !receiptImagePath
  ) {
    throw new Error(
      "La captura de la transferencia es requerida."
    );
  }

  const existingTransfer =
    methodValue === "transfer"
      ? (
          await getCartPayments(
            cart.cart.id,
            cart.cart.organization_id
          )
        ).find(
          (payment) =>
            payment.method === "transfer" &&
            payment.status === "pending"
        ) ?? null
      : null;

  if (existingTransfer) {
    return updatePayment(
      existingTransfer.id,
      existingTransfer.organization_id,
      {
        amount: cart.totals.total,
        reference:
          readText(formData, "reference") ||
          null,
        receipt_image_path:
          receiptImagePath,
        notes:
          readText(formData, "notes") ||
          null,
        updated_at:
          new Date().toISOString(),
      }
    );
  }

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
    receipt_image_path:
      receiptImagePath,
    notes:
      readText(formData, "notes") || null,
    paid_at: isDeferred
      ? null
      : new Date().toISOString(),
  });
}
