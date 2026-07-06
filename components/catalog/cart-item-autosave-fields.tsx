"use client";

import { useEffect, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { updateCatalogCartItem } from "@/app/catalogo/carrito/actions";

type Props = {
  itemId: string;
  quantity: number;
  notes: string | null;
};

function SaveStatus() {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <span className="col-span-2 text-xs font-semibold text-pink-600">
      Guardando...
    </span>
  );
}

export function CartItemAutosaveFields({
  itemId,
  quantity,
  notes,
}: Props) {
  const [, startTransition] =
    useTransition();

  useEffect(() => {
    const forms =
      document.querySelectorAll<HTMLFormElement>(
        `[data-cart-item-form="${itemId}"]`
      );
    const cleanups: Array<() => void> = [];

    for (const form of forms) {
      const handler = () => {
        startTransition(() => {
          form.requestSubmit();
        });
      };

      form.addEventListener(
        "change",
        handler
      );

      cleanups.push(() => {
        form.removeEventListener(
          "change",
          handler
        );
      });
    }

    return () => {
      cleanups.forEach((cleanup) =>
        cleanup()
      );
    };
  }, [itemId, startTransition]);

  return (
    <form
      action={updateCatalogCartItem.bind(
        null,
        itemId
      )}
      data-cart-item-form={itemId}
      className="mt-3 grid grid-cols-[5rem_1fr] gap-2"
    >
      <input
        key={`${itemId}-quantity-${quantity}`}
        name="quantity"
        type="number"
        min="1"
        defaultValue={quantity}
        className="min-h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
      />
      <input
        key={`${itemId}-notes-${notes ?? ""}`}
        name="notes"
        defaultValue={notes ?? ""}
        placeholder="Nota"
        className="min-h-10 min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
      />
      <SaveStatus />
    </form>
  );
}
