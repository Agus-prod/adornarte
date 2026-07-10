import { ShoppingBag } from "lucide-react";
import { addCatalogComboItems } from "@/app/catalogo/carrito/actions";
import type {
  CatalogProductDetail,
  CatalogProductSummary,
} from "@/lib/catalog/types";

type Props = {
  product: CatalogProductDetail;
  products: CatalogProductSummary[];
};

function formatMoney(value: number | null) {
  return `L ${(value ?? 0).toFixed(2)}`;
}

export function ProductCombosSection({
  product,
  products,
}: Props) {
  const combos = products.slice(0, 3);

  if (combos.length === 0) {
    return null;
  }

  const basePrice =
    product.salePrice ?? 0;

  return (
    <section className="space-y-4 rounded-[2rem] border border-pink-100 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
          Completa tu compra
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight">
          Combos sugeridos
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Productos de la misma categoría para agregarlos juntos a precio normal.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {combos.map((item) => {
          const itemPrice =
            item.salePrice ?? 0;
          const total =
            basePrice + itemPrice;

          return (
            <form
              key={item.id}
              action={addCatalogComboItems}
              className="rounded-3xl border border-zinc-100 bg-pink-50/40 p-4"
            >
              <input
                type="hidden"
                name="product_id"
                value={product.id}
              />
              <input
                type="hidden"
                name="product_id"
                value={item.id}
              />

              <div className="text-sm font-semibold text-zinc-500">
                {product.name}
              </div>
              <div className="my-2 text-center text-xl font-black text-pink-600">
                +
              </div>
              <div className="font-bold leading-tight">
                {item.name}
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500">
                    Precio normal
                  </p>
                  <p className="text-lg font-black">
                    {formatMoney(total)}
                  </p>
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-pink-600 px-4 text-sm font-bold text-white transition hover:bg-pink-700"
                >
                  <ShoppingBag size={16} />
                  Añadir
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </section>
  );
}
