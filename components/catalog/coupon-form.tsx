"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  applyCatalogCoupon,
  type CatalogCouponActionState,
} from "@/app/catalogo/carrito/actions";

type Props = {
  defaultValue?: string | null;
  inputClassName: string;
  buttonClassName: string;
  messageClassName: string;
};

const idleState: CatalogCouponActionState = {
  status: "idle",
  message: null,
};

function CouponSubmitButton({
  className,
}: {
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? "Aplicando..." : "Aplicar"}
    </button>
  );
}

export function CouponForm({
  defaultValue,
  inputClassName,
  buttonClassName,
  messageClassName,
}: Props) {
  const [state, formAction] =
    useActionState(
      applyCatalogCoupon,
      idleState
    );

  return (
    <div className="space-y-3">
      {state.status === "error" &&
      state.message ? (
        <div className={messageClassName}>
          {state.message}
        </div>
      ) : null}

      <form
        action={formAction}
        className="flex gap-2"
      >
        <input
          name="coupon_code"
          defaultValue={defaultValue ?? ""}
          placeholder="Cupon"
          className={inputClassName}
        />
        <CouponSubmitButton
          className={buttonClassName}
        />
      </form>
    </div>
  );
}
