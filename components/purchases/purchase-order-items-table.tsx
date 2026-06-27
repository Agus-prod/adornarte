"use client";
import { formatCurrency } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deletePurchaseItemAction,
  updatePurchaseItemAction,
} from "@/app/(dashboard)/compras/ordenes/actions";
type Item = {
  id: string;
  quantity: number;
  cost_price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    sku: string | null;
  } | null;
};

type Props = {
  items: Item[];
  canEdit: boolean;
};

export function PurchaseOrderItemsTable({
  items,
  canEdit,
}: Props) {
  const router = useRouter();

const [isPending, startTransition] =
  useTransition();

const [editingId, setEditingId] =
  useState<string | null>(null);

const [editingQuantity, setEditingQuantity] =
  useState(1);

const [editingCostPrice, setEditingCostPrice] =
  useState("");  function handleEdit(item: Item) {
  setEditingId(item.id);

  setEditingQuantity(item.quantity);

  setEditingCostPrice(
    item.cost_price.toString()
  );
}
function handleDelete(itemId: string) {
  if (
    !window.confirm(
      "¿Eliminar este producto de la orden?"
    )
  ) {
    return;
  }

  startTransition(async () => {
    const result =
      await deletePurchaseItemAction(itemId);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    router.refresh();
  });
}
async function handleSave() {
  if (!editingId) return;
if (editingQuantity <= 0) {
  toast.error("La cantidad debe ser mayor que cero.");
  return;
}

if (Number(editingCostPrice) <= 0) {
  toast.error("El costo debe ser mayor que cero.");
  return;
}
  startTransition(async () => {
    const result =
      await updatePurchaseItemAction(
        editingId,
        editingQuantity,
        Number(editingCostPrice)
      );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setEditingId(null);

    router.refresh();
  });
}
function handleCancel() {
  setEditingId(null);
  setEditingQuantity(1);
  setEditingCostPrice("");
}
if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white py-12 text-center">
        <p className="text-lg font-medium text-gray-500">
          No hay productos agregados.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Los productos aparecerán aquí después de agregarlos.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">

            <th className="px-6 py-4">
              Producto
            </th>

            <th className="px-6 py-4">
              Cantidad
            </th>

            <th className="px-6 py-4">
              Costo
            </th>

            <th className="px-6 py-4">
              Subtotal
            </th>

            <th className="px-6 py-4 text-right">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t"
            >
              <td className="px-6 py-4">

                <div className="font-medium">
                  {item.product?.name}
                </div>

                {item.product?.sku && (
                  <div className="text-sm text-gray-500">
                    {item.product.sku}
                  </div>
                )}

              </td>

              <td className="px-6 py-4">
  {editingId === item.id ? (
    <input
      type="number"
      min={1}
      value={editingQuantity}
      onChange={(e) =>
        setEditingQuantity(Number(e.target.value))
      }
      className="w-24 rounded-lg border px-3 py-2"
    />
  ) : (
    item.quantity
  )}
</td>

              <td className="px-6 py-4">
  {editingId === item.id ? (
    <input
      type="number"
      min={0}
      step={0.01}
      value={editingCostPrice}
      onChange={(e) =>
        setEditingCostPrice(e.target.value)
      }
      className="w-24 rounded-lg border px-3 py-2"
    />
  ) : (
    formatCurrency(item.cost_price)
  )}
</td>

              <td className="px-6 py-4 font-semibold">
                {editingId === item.id
  ? formatCurrency(
      editingQuantity *
        Number(editingCostPrice || 0)
    )
  : formatCurrency(item.subtotal)}
              </td>

              <td className="px-6 py-4">

  {canEdit && (

    <div className="flex justify-end gap-2">

      {editingId === item.id ? (

        <>
          <button
            disabled={isPending}
            onClick={handleSave}
            className="
              rounded-lg
              bg-green-600
              px-3
              py-1
              text-white
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            Guardar
          </button>

          <button
            disabled={isPending}
            onClick={handleCancel}
            className="
              rounded-lg
              border
              px-3
              py-1
              hover:bg-gray-100
              disabled:opacity-50
            "
          >
            Cancelar
          </button>
        </>

      ) : (

        <>
          <button
            disabled={isPending}
            onClick={() => handleEdit(item)}
            className="
              rounded-lg
              border
              px-3
              py-1
              hover:bg-gray-100
            "
          >
            Editar
          </button>

          <button
            disabled={isPending}
            onClick={() => handleDelete(item.id)}
            className="
              rounded-lg
              border
              border-red-300
              px-3
              py-1
              text-red-600
              hover:bg-red-50
            "
          >
            Eliminar
          </button>
        </>

      )}

    </div>

  )}

</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
