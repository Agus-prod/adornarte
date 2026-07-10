import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  removeCatalogCartItemAction,
  removeCatalogCoupon,
  updateCatalogCartItem,
} from "@/app/catalogo/carrito/actions";
import { CouponForm } from "@/components/catalog/coupon-form";
import type { CatalogCartDetail } from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail | null;
};

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

export function CartSummary({
  cart,
}: Props) {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center text-gray-500">
        Tu carrito esta vacio.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-[5rem_1fr]"
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={96}
                height={96}
                unoptimized
                className="h-20 w-20 rounded-lg object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-gray-50" />
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.sku ?? "Sin SKU"}
                  </p>
                </div>
                <div className="font-semibold text-pink-600">
                  {formatMoney(
                    Number(item.unit_price)
                  )}
                </div>
              </div>

              <form
                action={updateCatalogCartItem.bind(
                  null,
                  item.id
                )}
                className="grid gap-3 md:grid-cols-[7rem_1fr_auto]"
              >
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue={item.quantity}
                  className="min-h-10 rounded-lg border px-3 text-sm"
                />
                <input
                  name="notes"
                  defaultValue={
                    item.notes ?? ""
                  }
                  placeholder="Notas"
                  className="min-h-10 rounded-lg border px-3 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg border px-4 text-sm font-semibold hover:bg-gray-50"
                >
                  Actualizar
                </button>
              </form>

              <form
                action={removeCatalogCartItemAction.bind(
                  null,
                  item.id
                )}
              >
                <button
                  type="submit"
                  aria-label={`Eliminar ${item.name}`}
                  title="Eliminar"
                  className="inline-flex size-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Resumen
        </h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>
              {formatMoney(
                cart.totals.subtotal
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Descuento</dt>
            <dd>
              {formatMoney(
                cart.totals.discountTotal
              )}
            </dd>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>
              {formatMoney(
                cart.totals.total
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-5 space-y-3 border-t pt-4">
          <CouponForm
            defaultValue={cart.cart.coupon_code}
            inputClassName="min-h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm"
            buttonClassName="rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
            messageClassName="rounded-lg border border-pink-100 bg-pink-50 p-3 text-sm font-semibold text-pink-700"
          />

          {cart.cart.coupon_code && (
            <form action={removeCatalogCoupon}>
              <button
                type="submit"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Quitar {cart.cart.coupon_code}
              </button>
            </form>
          )}
        </div>

        <Link
          href="/catalogo/checkout"
          className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Continuar al checkout
        </Link>
      </aside>
    </div>
  );
}
