"use client";

import { useState } from "react";

import type { ActiveProduct } from "@/lib/inventory/get-active-products";

import { ProductSelector } from "@/components/selectors/product-selector";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { addPurchaseItemAction } from "@/app/(dashboard)/compras/ordenes/actions";

type Props = {
  purchaseOrderId: string;
  products: ActiveProduct[];
};

export function PurchaseOrderItemsCard({
  purchaseOrderId,
  products,
}: Props){
  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [costPrice, setCostPrice] =
    useState("");

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleAddProduct() {
      if (!productId) {
        toast.error("Seleccione un producto.");
        return;
      }

      if (!costPrice || Number(costPrice) <= 0) {
        toast.error("Ingrese un costo mayor que cero.");
        return;
      }

      if (quantity <= 0) {
        toast.error("La cantidad debe ser mayor que cero.");
        return;
      }

      startTransition(async () => {
        const result = await addPurchaseItemAction({
          purchase_order_id: purchaseOrderId,
          product_id: productId,
          quantity,
          cost_price: Number(costPrice),
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);

        setProductId("");
        setQuantity(1);
        setCostPrice("");

        router.refresh();
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
  loading={isPending}
  onClick={handleAddProduct}
  type="button"
>
            + Agregar producto
          </Button>

        </div>

      </div>
    </div>
  );
}