"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  productName: string;
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
      onClick={() =>
        emitCartEvent(
          "catalog-cart:add-start",
          productName
        )
      }
      className="min-h-11 w-full rounded-xl bg-pink-600 px-3 text-sm font-semibold leading-tight text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-80 sm:rounded-2xl"
    >
      {pending ? "Agregando..." : "Agregar"}
    </button>
  );
}
