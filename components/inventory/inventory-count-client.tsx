"use client";

import { useMemo, useState } from "react";
import {
  Barcode,
  Minus,
  Plus,
} from "lucide-react";
import { BarcodeScannerDialog } from "@/components/barcode/barcode-scanner-dialog";

type CountProduct = {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  stock: number | null;
};

type CountMap = Record<string, number>;

export function InventoryCountClient({
  products,
}: {
  products: CountProduct[];
}) {
  const [counts, setCounts] =
    useState<CountMap>({});
  const [
    scannerOpen,
    setScannerOpen,
  ] = useState(false);
  const [
    manualCode,
    setManualCode,
  ] = useState("");
  const [message, setMessage] =
    useState<string | null>(null);

  const countedProducts = useMemo(
    () =>
      products
        .map((product) => {
          const counted =
            counts[product.id] ?? 0;
          const expected =
            product.stock ?? 0;

          return {
            ...product,
            counted,
            expected,
            difference:
              counted - expected,
          };
        })
        .filter(
          (product) =>
            product.counted > 0 ||
            product.expected > 0
        ),
    [counts, products]
  );

  const totalExpected =
    countedProducts.reduce(
      (sum, product) =>
        sum + product.expected,
      0
    );
  const totalCounted =
    countedProducts.reduce(
      (sum, product) =>
        sum + product.counted,
      0
    );

  function updateCount(
    productId: string,
    quantity: number
  ) {
    setCounts((current) => ({
      ...current,
      [productId]: Math.max(
        quantity,
        0
      ),
    }));
  }

  function scanCode(code: string) {
    const cleanCode = code.trim();

    if (!cleanCode) {
      return;
    }

    const product = products.find(
      (item) =>
        item.barcode === cleanCode ||
        item.sku === cleanCode
    );

    if (!product) {
      setMessage(
        `No encontre producto con codigo ${cleanCode}.`
      );
      setManualCode(cleanCode);
      return;
    }

    setCounts((current) => ({
      ...current,
      [product.id]:
        (current[product.id] ?? 0) + 1,
    }));
    setManualCode("");
    setMessage(
      `${product.name} contado.`
    );
  }

  function scanManualCode() {
    scanCode(manualCode);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Inventario esperado
          </p>
          <p className="mt-2 text-3xl font-black">
            {totalExpected}
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Contado fisico
          </p>
          <p className="mt-2 text-3xl font-black text-pink-600">
            {totalCounted}
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Diferencia total
          </p>
          <p className="mt-2 text-3xl font-black">
            {totalCounted - totalExpected}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Codigo manual
            </label>
            <input
              value={manualCode}
              onChange={(event) =>
                setManualCode(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  scanManualCode();
                }
              }}
              placeholder="SKU o codigo de barra"
              className="min-h-12 w-full rounded-2xl border px-4"
            />
          </div>
          <button
            type="button"
            onClick={scanManualCode}
            className="min-h-12 rounded-2xl border px-5 font-bold"
          >
            Contar
          </button>
          <button
            type="button"
            onClick={() =>
              setScannerOpen(true)
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-5 font-bold text-white"
          >
            <Barcode className="size-5" />
            Escanear
          </button>
        </div>
        {message ? (
          <p className="mt-3 rounded-2xl bg-pink-50 p-3 text-sm font-medium text-pink-700">
            {message}
          </p>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_7rem_7rem_7rem] gap-3 border-b bg-zinc-50 p-4 text-xs font-bold uppercase text-zinc-500">
          <span>Producto</span>
          <span className="text-right">
            Sistema
          </span>
          <span className="text-right">
            Contado
          </span>
          <span className="text-right">
            Diferencia
          </span>
        </div>
        <div className="divide-y">
          {countedProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_7rem_7rem_7rem] items-center gap-3 p-4 text-sm"
            >
              <div>
                <p className="font-bold">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.sku ?? "Sin SKU"} / {product.barcode ?? "Sin codigo"}
                </p>
              </div>
              <p className="text-right">
                {product.expected}
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCount(
                      product.id,
                      product.counted - 1
                    )
                  }
                  className="rounded-full border p-1"
                  aria-label="Restar conteo"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-7 text-center font-bold">
                  {product.counted}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateCount(
                      product.id,
                      product.counted + 1
                    )
                  }
                  className="rounded-full border p-1"
                  aria-label="Sumar conteo"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <p
                className={`text-right font-bold ${
                  product.difference === 0
                    ? "text-emerald-600"
                    : "text-pink-600"
                }`}
              >
                {product.difference}
              </p>
            </div>
          ))}
        </div>
      </section>

      {scannerOpen && (
        <BarcodeScannerDialog
          label="Conteo"
          title="Escanear inventario fisico"
          onClose={() =>
            setScannerOpen(false)
          }
          onDetected={scanCode}
        />
      )}
    </div>
  );
}
