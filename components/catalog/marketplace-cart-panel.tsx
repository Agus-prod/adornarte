import Link from "next/link";
import {
  removeCatalogCartItemAction,
  removeCatalogCoupon,
} from "@/app/catalogo/carrito/actions";
import { CartItemAutosaveFields } from "@/components/catalog/cart-item-autosave-fields";
import { CouponForm } from "@/components/catalog/coupon-form";
import type { CatalogCartDetail } from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail | null;
  variant?: "page" | "dropdown";
};

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

export function MarketplaceCartPanel({
  cart,
  variant = "page",
}: Props) {
  const itemCount =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <aside
      className={
        variant === "dropdown"
          ? "max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-2xl shadow-pink-100/70 sm:max-h-[min(34rem,calc(100vh-6rem))] sm:rounded-3xl sm:p-5"
          : "h-fit rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-xl shadow-pink-100/50 sm:rounded-3xl sm:p-5"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-pink-600">
            Tu compra
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">
            Carrito
          </h2>
        </div>
        <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-700">
          {itemCount}
        </span>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-pink-100 bg-pink-50/50 p-5 text-sm text-zinc-500">
          Agrega productos y apareceran aqui sin salir del catalogo.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="max-h-[18rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[22rem]">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold leading-tight">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatMoney(
                        Number(item.unit_price)
                      )}
                    </p>
                  </div>
                  <form
                    action={removeCatalogCartItemAction.bind(
                      null,
                      item.id
                    )}
                  >
                    <button
                      type="submit"
                      className="text-xs font-semibold text-zinc-400 hover:text-red-600"
                    >
                      Quitar
                    </button>
                  </form>
                </div>

                <CartItemAutosaveFields
                  itemId={item.id}
                  quantity={item.quantity}
                  notes={item.notes}
                />
              </div>
            ))}
          </div>

          <CouponForm
            defaultValue={cart.cart.coupon_code}
            inputClassName="min-h-10 min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 text-sm"
            buttonClassName="rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            messageClassName="rounded-2xl border border-pink-100 bg-pink-50 p-3 text-sm font-semibold text-pink-700"
          />

          {cart.cart.coupon_code && (
            <form action={removeCatalogCoupon}>
              <button
                type="submit"
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-900"
              >
                Quitar {cart.cart.coupon_code}
              </button>
            </form>
          )}

          <dl className="space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>
                {formatMoney(
                  cart.totals.subtotal
                )}
              </dd>
            </div>
            <div className="flex justify-between text-zinc-500">
              <dt>Descuento</dt>
              <dd>
                {formatMoney(
                  cart.totals.discountTotal
                )}
              </dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-pink-600">
                {formatMoney(
                  cart.totals.total
                )}
              </dd>
            </div>
          </dl>

          <Link
            href="/catalogo/checkout"
            className="flex min-h-11 items-center justify-center rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Completar pedido
          </Link>
        </div>
      )}
    </aside>
  );
}
