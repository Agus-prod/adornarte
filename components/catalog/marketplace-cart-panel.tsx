"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Trash2 } from "lucide-react";
import {
  clearCatalogCartAction,
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

type OptimisticCartItem = CatalogCartDetail["items"][number];

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

function getCartTotals(items: OptimisticCartItem[]) {
  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.unit_price) * item.quantity,
    0
  );

  return {
    subtotal,
    discountTotal: 0,
    total: subtotal,
  };
}

export function MarketplaceCartPanel({
  cart,
  variant = "page",
}: Props) {
  const [items, setItems] = useState<
    OptimisticCartItem[]
  >(cart?.items ?? []);
  const [optimisticTotals, setOptimisticTotals] =
    useState(() =>
      getCartTotals(cart?.items ?? [])
    );
  const [isClearing, startClearing] =
    useTransition();
  const lastClearAtRef = useRef(0);
  const lastClearedCartIdRef = useRef<
    string | null
  >(null);
  const currentCartIdRef = useRef<
    string | null
  >(cart?.cart.id ?? null);

  useEffect(() => {
    currentCartIdRef.current =
      cart?.cart.id ?? null;
  }, [cart?.cart.id]);

  useEffect(() => {
    const nextItems = cart?.items ?? [];
    const nextCartId =
      cart?.cart.id ?? null;

    if (
      lastClearedCartIdRef.current &&
      nextCartId &&
      nextCartId !==
        lastClearedCartIdRef.current
    ) {
      lastClearAtRef.current = 0;
      lastClearedCartIdRef.current = null;
    }

    if (
      nextCartId &&
      nextCartId ===
        lastClearedCartIdRef.current &&
      nextItems.length > 0
    ) {
      return;
    }

    if (lastClearAtRef.current > 0) {
      const cartUpdatedAt = cart?.cart.updated_at
        ? new Date(
            cart.cart.updated_at
          ).getTime()
        : 0;

      if (
        nextItems.length > 0 &&
        cartUpdatedAt <
          lastClearAtRef.current
      ) {
        return;
      }

      if (nextItems.length === 0) {
        lastClearAtRef.current = 0;
      }
    }

    setItems(nextItems);
    setOptimisticTotals(
      getCartTotals(nextItems)
    );
  }, [cart]);

  useEffect(() => {
    function handleOptimisticAdd(
      event: Event
    ) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const detail = event.detail as {
        productId?: string;
        variantId?: string | null;
        name?: string;
        quantity?: number;
        unitPrice?: number;
        imageUrl?: string | null;
      };

      if (
        !detail.productId ||
        !detail.name ||
        !detail.unitPrice
      ) {
        return;
      }

      const productId = detail.productId;
      const productName = detail.name;
      const unitPrice = detail.unitPrice;

      setItems((currentItems) => {
        const quantity =
          detail.quantity ?? 1;
        const existingIndex =
          currentItems.findIndex(
            (item) =>
              item.product_id ===
                productId &&
              item.variant_id ===
                (detail.variantId ?? null)
          );

        const nextItems =
          [...currentItems];

        if (existingIndex >= 0) {
          const existing =
            nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...existing,
            quantity:
              existing.quantity +
              quantity,
          };
        } else {
          nextItems.unshift({
            id: `optimistic-${productId}-${detail.variantId ?? "default"}`,
            cart_id:
              cart?.cart.id ?? "optimistic",
            created_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
            organization_id:
              cart?.cart.organization_id ??
              "optimistic",
            product_id: productId,
            variant_id:
              detail.variantId ?? null,
            name: productName,
            sku: null,
            image_url:
              detail.imageUrl ?? null,
            quantity,
            notes: null,
            unit_price: unitPrice,
          });
        }

        setOptimisticTotals(
          getCartTotals(nextItems)
        );

        return nextItems;
      });
    }

    window.addEventListener(
      "catalog-cart:optimistic-add",
      handleOptimisticAdd
    );

    return () => {
      window.removeEventListener(
        "catalog-cart:optimistic-add",
        handleOptimisticAdd
      );
    };
  }, [cart]);

  useEffect(() => {
    function handleItemChange(event: Event) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const detail = event.detail as {
        itemId?: string;
        quantity?: number;
      };

      if (
        !detail.itemId ||
        !detail.quantity ||
        detail.quantity < 1
      ) {
        return;
      }

      setItems((currentItems) => {
        const nextItems =
          currentItems.map((item) =>
            item.id === detail.itemId
              ? {
                  ...item,
                  quantity:
                    detail.quantity ?? item.quantity,
                }
              : item
          );

        setOptimisticTotals(
          getCartTotals(nextItems)
        );

        return nextItems;
      });
    }

    window.addEventListener(
      "catalog-cart:item-change",
      handleItemChange
    );

    return () => {
      window.removeEventListener(
        "catalog-cart:item-change",
        handleItemChange
      );
    };
  }, []);

  useEffect(() => {
    function handleOptimisticRemove(
      event: Event
    ) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const detail = event.detail as {
        itemId?: string;
      };

      if (!detail.itemId) {
        return;
      }

      setItems((currentItems) => {
        const nextItems =
          currentItems.filter(
            (item) =>
              item.id !== detail.itemId
          );

        setOptimisticTotals(
          getCartTotals(nextItems)
        );

        return nextItems;
      });
    }

    function handleOptimisticClear() {
      lastClearAtRef.current = Date.now();
      lastClearedCartIdRef.current =
        currentCartIdRef.current;
      setItems([]);
      setOptimisticTotals(
        getCartTotals([])
      );
    }

    window.addEventListener(
      "catalog-cart:optimistic-remove",
      handleOptimisticRemove
    );
    window.addEventListener(
      "catalog-cart:optimistic-clear",
      handleOptimisticClear
    );

    return () => {
      window.removeEventListener(
        "catalog-cart:optimistic-remove",
        handleOptimisticRemove
      );
      window.removeEventListener(
        "catalog-cart:optimistic-clear",
        handleOptimisticClear
      );
    };
  }, []);

  const totals = useMemo(() => {
    if (cart && items === cart.items) {
      return cart.totals;
    }

    return {
      subtotal:
        optimisticTotals.subtotal,
      discountTotal:
        cart?.totals.discountTotal ?? 0,
      shippingTotal:
        cart?.totals.shippingTotal ?? 0,
      taxTotal:
        cart?.totals.taxTotal ?? 0,
      total:
        optimisticTotals.subtotal -
        (cart?.totals.discountTotal ?? 0),
    };
  }, [cart, items, optimisticTotals]);

  const itemCount =
    items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  const canClear =
    items.length > 0 && !isClearing;

  return (
    <aside
      onWheel={(event) => {
        event.stopPropagation();
      }}
      className={
        variant === "dropdown"
          ? "max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain touch-pan-y rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-2xl shadow-pink-100/70 sm:max-h-[min(34rem,calc(100vh-6rem))] sm:rounded-3xl sm:p-5"
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
      {items.length > 0 && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            disabled={!canClear}
            onClick={() => {
              sessionStorage.setItem(
                "adornarte_cart_clearing",
                "true"
              );
              window.dispatchEvent(
                new CustomEvent(
                  "catalog-cart:optimistic-clear"
                )
              );
              startClearing(() => {
                void clearCatalogCartAction()
                  .catch(() => {
                    lastClearAtRef.current = 0;
                  })
                  .finally(() => {
                    sessionStorage.removeItem(
                      "adornarte_cart_clearing"
                    );
                  });
              });
            }}
            className="text-xs font-semibold uppercase tracking-wide text-zinc-400 transition hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
          >
            {isClearing
              ? "Limpiando"
              : "Limpiar todo"}
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-pink-100 bg-pink-50/50 p-5 text-sm text-zinc-500">
          Comienza a cargar productos y los verás aquí sin salir del catálogo.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
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
                  {!item.id.startsWith(
                    "optimistic-"
                  ) && (
                    <form
                      action={removeCatalogCartItemAction.bind(
                        null,
                        item.id
                      )}
                    >
                      <button
                        type="submit"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent(
                              "catalog-cart:optimistic-remove",
                              {
                                detail: {
                                  itemId: item.id,
                                  quantity:
                                    item.quantity,
                                },
                              }
                            )
                          );
                        }}
                        aria-label={`Eliminar ${item.name}`}
                        title="Eliminar"
                        className="flex size-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  )}
                </div>

                {!item.id.startsWith(
                  "optimistic-"
                ) && (
                  <CartItemAutosaveFields
                    itemId={item.id}
                    quantity={item.quantity}
                    notes={item.notes}
                    unitPrice={Number(
                      item.unit_price
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {cart && (
            <>
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
            </>
          )}

          <dl className="space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>
                  {formatMoney(
                  totals.subtotal
                )}
              </dd>
            </div>
            <div className="flex justify-between text-zinc-500">
              <dt>Descuento</dt>
              <dd>
                  {formatMoney(
                  totals.discountTotal
                )}
              </dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-pink-600">
                  {formatMoney(
                  totals.total
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
