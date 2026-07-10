"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  productName: string;
  optimisticItem?: {
    productId: string;
    variantId?: string | null;
    unitPrice: number;
    imageUrl?: string | null;
  };
};

function emitCartEvent(
  type: "catalog-cart:add-start" | "catalog-cart:add-done",
  productName: string
) {
  window.dispatchEvent(
    new CustomEvent(type, {
      detail: {
        productName,
      },
    })
  );
}

export function AddToCartSubmitButton({
  productName,
  optimisticItem,
}: Props) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      return;
    }

    if (wasPending.current) {
      emitCartEvent(
        "catalog-cart:add-done",
        productName
      );
      wasPending.current = false;
    }
  }, [pending, productName]);

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        const form =
          event.currentTarget.form;
        const formData = form
          ? new FormData(form)
          : null;
        const quantity = Number(
          formData?.get("quantity") ?? 1
        );

        if (optimisticItem) {
          window.dispatchEvent(
            new CustomEvent(
              "catalog-cart:optimistic-add",
              {
                detail: {
                  ...optimisticItem,
                  name: productName,
                  quantity:
                    Number.isFinite(quantity) &&
                    quantity > 0
                      ? quantity
                      : 1,
                },
              }
            )
          );
        }

        emitCartEvent(
          "catalog-cart:add-start",
          productName
        );
      }}
      className="min-h-11 w-full rounded-xl bg-pink-600 px-3 text-sm font-semibold leading-tight text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-80 sm:rounded-2xl"
    >
      {pending ? "Agregando..." : "Agregar"}
    </button>
  );
}
