"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { createSaleAction } from "@/app/(dashboard)/pos/actions";

type Product = {
  id: string;
  name: string;
  stock: number | null;
  sale_price: number | null;
};

type CartItem = Product & {
  quantity: number;
};

export function PosClient({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  function addToCart(
    product: Product
  ) {
    setCart((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        const stock =
          product.stock ?? 0;

        if (
          existing.quantity >= stock
        ) {
          alert(
            "No hay más stock disponible."
          );

          return current;
        }

        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(
    productId: string
  ) {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== productId
      )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    const product =
      products.find(
        (p) => p.id === productId
      );

    const stock =
      product?.stock ?? 0;

    if (quantity > stock) {
      alert(
        `Solo hay ${stock} unidades disponibles`
      );

      return;
    }

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  async function finishSale() {
    if (cart.length === 0) {
      alert(
        "Agrega productos al carrito."
      );
      return;
    }

    const items = cart.map(
      (item) => ({
        productId: item.id,
        quantity: item.quantity,
        price:
          item.sale_price ?? 0,
      })
    );

    startTransition(async () => {
      try {
        await createSaleAction(
          items
        );

        setCart([]);

        alert(
          "Venta registrada correctamente."
        );

        router.refresh();
      } catch (error) {
        console.error(error);

        alert(
          "Ocurrió un error al registrar la venta."
        );
      }
    });
  }

  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc +
        (item.sale_price ?? 0) *
          item.quantity,
      0
    );
  }, [cart]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Productos
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Buscar producto..."
            className="
              mb-4
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:ring-2
              focus:ring-pink-300
            "
          />

          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className="
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Stock:{" "}
                    {product.stock ?? 0}
                  </p>

                  <p className="mt-2 text-xl font-bold text-pink-600">
                    L{" "}
                    {Number(
                      product.sale_price ??
                        0
                    ).toFixed(2)}
                  </p>

                  <button
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      bg-pink-500
                      px-4
                      py-2
                      text-white
                      transition
                      hover:bg-pink-600
                    "
                  >
                    Agregar
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="
  rounded-3xl
  border
  border-white/60
  bg-white/80
  p-6
  shadow-sm
  backdrop-blur-xl
">
          <h2 className="mb-4 text-lg font-semibold">
            Carrito
          </h2>

          {cart.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
              No hay productos agregados.
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-3"
                >
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    L{" "}
                    {Number(
                      item.sale_price ?? 0
                    ).toFixed(2)}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <input
                      type="number"
                      min="1"
                      value={
                        item.quantity
                      }
                      onChange={(e) =>
                        updateQuantity(
                          item.id,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="w-20 rounded-lg border p-2"
                    />

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      className="font-medium text-red-600"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <span>Total</span>

              <span className="text-xl font-bold">
                L {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={finishSale}
              disabled={isPending}
              className="
                mt-4
                w-full
                rounded-xl
                bg-pink-500
                px-4
                py-3
                font-medium
                text-white
                transition
                hover:bg-pink-600
                disabled:opacity-50
              "
            >
              {isPending
                ? "Procesando..."
                : "Finalizar Venta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}