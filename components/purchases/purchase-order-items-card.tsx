"use client";

import { useState } from "react";

import type { ActiveProduct } from "@/lib/inventory/get-active-products";

import { ProductSelector } from "@/components/selectors/product-selector";
import { Button } from "@/components/ui/button";

type Props = {
  products: ActiveProduct[];
};

export function PurchaseOrderItemsCard({
  products,
}: Props) {
  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [costPrice, setCostPrice] =
    useState("");

  function handleAddProduct() {
    // Próximo commit:
    // Guardar en purchase_order_items
    console.log({
      productId,
      quantity,
      costPrice,
    });
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h3 className="text-lg font-semibold">
          Productos
        </h3>

        <p className="text-sm text-gray-500">
          Agregue productos a la orden.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-3">

        <div className="md:col-span-3">

          <label className="mb-2 block text-sm font-medium">
            Producto
          </label>

          <ProductSelector
            products={products}
            value={productId}
            onChange={setProductId}
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Cantidad
          </label>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="w-full rounded-xl border px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Costo
          </label>

          <input
            type="number"
            step="0.01"
            value={costPrice}
            onChange={(e) =>
              setCostPrice(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3"
          />

        </div>
                <div className="flex items-end">

          <Button
            className="w-full"
            onClick={handleAddProduct}
            type="button"
          >
            + Agregar producto
          </Button>

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-dashed py-12 text-center">

        <p className="text-lg font-medium text-gray-500">
          No hay productos agregados.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Los productos aparecerán aquí después de agregarlos.
        </p>

      </div>

    </div>
  );
}