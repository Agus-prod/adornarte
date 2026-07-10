import { addCatalogComboItems } from "@/app/catalogo/carrito/actions";
import type { CatalogComboSummary } from "@/lib/catalog/types";

type Props = {
  combos: CatalogComboSummary[];
};

export function CatalogComboRail({
  combos,
}: Props) {
  if (combos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase text-pink-600">
          Packs listos
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Combos especiales
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ahorra comprando productos que combinan bien juntos.
        </p>
      </div>

      <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-2">
        {combos.map((combo) => (
          <article
            key={combo.id}
            className="min-w-[19rem] max-w-[21rem] shrink-0 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm shadow-pink-100/60 sm:min-w-[24rem]"
          >
            <div className="grid grid-cols-3 gap-2 bg-pink-50/60 p-3">
              {combo.products
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product.id}
                    className="aspect-square overflow-hidden rounded-2xl bg-white"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-zinc-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="space-y-4 p-4">
              <div>
                <h3 className="line-clamp-2 text-base font-bold">
                  {combo.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {combo.products
                    .map(
                      (product) =>
                        `${product.quantity}x ${product.name}`
                    )
                    .join(" + ")}
                </p>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-400 line-through">
                    L{" "}
                    {combo.regularPrice.toFixed(2)}
                  </p>
                  <p className="text-2xl font-black text-pink-600">
                    L {combo.offerPrice.toFixed(2)}
                  </p>
                </div>
                {combo.savings > 0 && (
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">
                    Ahorras L{" "}
                    {combo.savings.toFixed(2)}
                  </span>
                )}
              </div>

              <form action={addCatalogComboItems}>
                {combo.products.flatMap((product) =>
                  Array.from({
                    length: product.quantity,
                  }).map((_, index) => (
                    <input
                      key={`${product.id}-${index}`}
                      type="hidden"
                      name="product_id"
                      value={product.id}
                    />
                  ))
                )}
                <button
                  type="submit"
                  className="min-h-11 w-full rounded-2xl bg-pink-600 px-4 text-sm font-bold text-white transition hover:bg-pink-700"
                >
                  Agregar combo
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
