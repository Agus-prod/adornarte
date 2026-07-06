"use client";

import { useState } from "react";
import type {
  CatalogBankAccount,
  CatalogPaymentMethod,
} from "@/lib/catalog/types";

type Props = {
  defaultMethod: CatalogPaymentMethod;
  bankAccounts: CatalogBankAccount[];
};

export function PaymentMethodFields({
  defaultMethod,
  bankAccounts,
}: Props) {
  const [method, setMethod] =
    useState<CatalogPaymentMethod>(
      defaultMethod
    );
  const showTransfer =
    method === "transfer";

  return (
    <>
      <input
        type="hidden"
        name="payment_method"
        value={method}
      />
      <select
        name="method"
        value={method}
        onChange={(event) =>
          setMethod(
            event.target
              .value as CatalogPaymentMethod
          )
        }
        className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
      >
        <option value="cash_on_delivery">
          Contra entrega
        </option>
        <option value="transfer">
          Transferencia
        </option>
      </select>

      {showTransfer && (
        <div className="space-y-3 rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm">
          <div>
            <h3 className="font-semibold text-pink-700">
              Cuentas para transferencia
            </h3>
            <p className="mt-1 text-zinc-600">
              Realiza el pago, escribe la referencia y adjunta la captura.
            </p>
          </div>

          {bankAccounts.length ? (
            <div className="grid gap-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border bg-white p-3"
                >
                  <div className="font-semibold">
                    {account.bankName}
                  </div>
                  <div className="mt-1 text-zinc-600">
                    {account.accountName}
                  </div>
                  <div className="mt-2 font-mono text-base font-semibold">
                    {account.accountNumber}
                  </div>
                  <div className="mt-1 text-xs uppercase text-zinc-500">
                    {account.accountType ??
                      "Cuenta"}{" "}
                    / {account.currency}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white p-3 text-zinc-600">
              Aun no hay cuentas bancarias configuradas para transferencia.
            </div>
          )}

          <input
            name="reference"
            placeholder="Referencia de transferencia"
            className="min-h-12 w-full rounded-2xl border border-pink-100 bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-700">
              Captura de la transferencia
            </span>
            <input
              type="file"
              name="receipt_image"
              accept="image/*"
              required
              className="block w-full rounded-2xl border border-pink-100 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-pink-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <textarea
            name="notes"
            rows={3}
            placeholder="Notas de pago"
            className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
          />
        </div>
      )}
    </>
  );
}
