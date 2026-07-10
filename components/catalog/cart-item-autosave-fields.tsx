"use client";

import { useEffect, useTransition } from "react";
import { updateCatalogCartItem } from "@/app/catalogo/carrito/actions";

type Props = {
  itemId: string;
  quantity: number;
  notes: string | null;
  unitPrice?: number;
};

export function CartItemAutosaveFields({
  itemId,
  quantity,
  notes,
  unitPrice,
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
      let timer: ReturnType<
        typeof setTimeout
      > | null = null;

      const handler = () => {
        const formData = new FormData(form);
        const nextQuantity = Number(
          formData.get("quantity") ?? quantity
        );

        if (
          Number.isFinite(nextQuantity) &&
          nextQuantity > 0
        ) {
          window.dispatchEvent(
            new CustomEvent(
              "catalog-cart:item-change",
              {
                detail: {
                  itemId,
                  quantity: nextQuantity,
                  unitPrice,
                },
              }
            )
          );
        }

        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          startTransition(() => {
            form.requestSubmit();
          });
        }, 250);
      };

      const submitOnChange = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        startTransition(() => {
          form.requestSubmit();
        });
      };

      form.addEventListener("input", handler);
      form.addEventListener(
        "change",
        submitOnChange
      );

      cleanups.push(() => {
        if (timer) {
          clearTimeout(timer);
        }
        form.removeEventListener(
          "input",
          handler
        );
        form.removeEventListener(
          "change",
          submitOnChange
        );
      });
    }

    return () => {
      cleanups.forEach((cleanup) =>
        cleanup()
      );
    };
  }, [
    itemId,
    quantity,
    startTransition,
    unitPrice,
  ]);

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
    </form>
  );
}
