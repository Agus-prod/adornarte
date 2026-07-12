"use client";

import { createMovement } from "@/app/(dashboard)/inventario/movimientos/actions";
import { Barcode } from "lucide-react";
import { useState } from "react";
import { BarcodeScannerDialog } from "@/components/barcode/barcode-scanner-dialog";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  stock: number | null;
};

export function StockMovementForm({
  products,
}: {
  products: Product[];
}) {
  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");
  const [
    scannerOpen,
    setScannerOpen,
  ] = useState(false);
  const [
    scannedMessage,
    setScannedMessage,
  ] = useState<string | null>(null);

  function selectProductByCode(code: string) {
    const cleanCode = code.trim();
    const product = products.find(
      (item) =>
        item.barcode === cleanCode ||
        item.sku === cleanCode
    );

    if (!product) {
      setScannedMessage(
        `No encontre producto con codigo ${cleanCode}.`
      );
      return;
    }

    setSelectedProductId(product.id);
    setScannedMessage(
      `${product.name} seleccionado.`
    );
  }

  return (
    <form
      action={createMovement}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Producto
        </label>

        <select
          name="product_id"
          required
          value={selectedProductId}
          onChange={(event) =>
            setSelectedProductId(
              event.target.value
            )
          }
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        >
          <option value="">
            Seleccionar producto
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} (Stock: {product.stock ?? 0})
            </option>
          ))}
        </select>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() =>
              setScannerOpen(true)
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white"
          >
            <Barcode className="size-4" />
            Escanear producto
          </button>
          {scannedMessage ? (
            <p className="text-sm font-medium text-zinc-500">
              {scannedMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Tipo de movimiento
        </label>

        <select
          name="movement_type"
          required
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        >
          <option value="ENTRADA">
            Entrada
          </option>

          <option value="SALIDA">
            Salida
          </option>

          <option value="AJUSTE">
            Ajuste
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Cantidad
        </label>

        <input
          type="number"
          min="1"
          name="quantity"
          required
          className="min-h-11 w-full rounded-xl border p-3 text-base"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Notas
        </label>

        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-xl border p-3 text-base"
        />
      </div>

      <button
        type="submit"
        className="min-h-12 w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white sm:w-auto"
      >
        Registrar Movimiento
      </button>

      {scannerOpen && (
        <BarcodeScannerDialog
          label="Inventario"
          title="Escanear producto para movimiento"
          onClose={() =>
            setScannerOpen(false)
          }
          onDetected={selectProductByCode}
        />
      )}
    </form>
  );
}
