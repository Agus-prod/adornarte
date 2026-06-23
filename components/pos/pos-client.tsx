"use client";

import {
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSaleAction } from "@/app/(dashboard)/pos/actions";

type Product = {
  id: string;
  name: string;
  stock: number | null;
  sale_price: number | null;
};

type Customer = {
  id: string;
  name: string;
};

type CartItem = Product & {
  quantity: number;
};

export function PosClient({
  products,
  customers,
}: {
  products: Product[];
  customers: Customer[];
}) {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  const [
  selectedCustomer,
  setSelectedCustomer,
] = useState("");

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
    const stock =
      product.stock ?? 0;

    if (stock <= 0) {
      toast.error(
        "Este producto no tiene stock."
      );
      return;
    }

    setCart((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        if (
          existing.quantity >= stock
        ) {
          toast.error(
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
      toast.warning(
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
      toast.info(
        "Agrega productos al carrito."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `¿Confirmar venta por L ${total.toFixed(
          2
        )}?`
      );

    if (!confirmed) {
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
  items,
  selectedCustomer || undefined
);

        setCart([]);

        toast.success(
          "Venta registrada correctamente."
        );

        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error(
          "Ocurrió un error al registrar la venta."
        );
      }
    });
  }

const total = cart.reduce(
  (acc, item) =>
    acc +
    (item.sale_price ?? 0) *
      item.quantity,
  0
);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Package size={20} />
            <h2 className="text-lg font-semibold">
              Productos
            </h2>
          </div>

          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

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
                w-full
                rounded-xl
                border
                py-3
                pl-10
                pr-4
                outline-none
                focus:ring-2
                focus:ring-pink-300
              "
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredProducts.map(
              (product) => {
                const stock =
                  product.stock ?? 0;

                const noStock =
                  stock <= 0;

                return (
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
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">
                        {product.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          noStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {noStock
                          ? "Sin stock"
                          : `${stock} disponibles`}
                      </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-pink-600">
                      L{" "}
                      {Number(
                        product.sale_price ??
                          0
                      ).toFixed(2)}
                    </p>

                    <button
                      disabled={noStock}
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                      className={`mt-4 w-full rounded-xl px-4 py-2 font-medium text-white transition ${
                        noStock
                          ? "cursor-not-allowed bg-gray-300"
                          : "bg-pink-500 hover:bg-pink-600"
                      }`}
                    >
                      {noStock
                        ? "Sin stock"
                        : "Agregar"}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-semibold">
              Carrito
            </h2>
          </div>

          <div className="mt-4">
  <label className="mb-2 block text-sm font-medium">
    Cliente
  </label>

  <select
    value={selectedCustomer}
    onChange={(e) =>
      setSelectedCustomer(
        e.target.value
      )
    }
    className="
      w-full
      rounded-xl
      border
      p-3
    "
  >
    <option value="">
      Consumidor Final
    </option>

    {customers.map((customer) => (
      <option
        key={customer.id}
        value={customer.id}
      >
        {customer.name}
      </option>
    ))}
  </select>
</div>

          {cart.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
              No hay productos agregados.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const subtotal =
                  (item.sale_price ??
                    0) *
                  item.quantity;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          L{" "}
                          {Number(
                            item.sale_price ??
                              0
                          ).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                        className="text-sm font-medium text-red-600"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity -
                                1
                            )
                          }
                          className="rounded-lg border p-2"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-[30px] text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity +
                                1
                            )
                          }
                          className="rounded-lg border p-2"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Subtotal
                        </p>

                        <p className="font-bold">
                          L{" "}
                          {subtotal.toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 border-t pt-6">
            <p className="text-center text-sm text-gray-500">
              TOTAL
            </p>

            <p className="text-center text-4xl font-bold text-pink-600">
              L {total.toFixed(2)}
            </p>

            <button
              onClick={finishSale}
              disabled={
                isPending ||
                cart.length === 0
              }
              className="
                mt-5
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