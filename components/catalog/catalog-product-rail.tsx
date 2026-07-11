import Image from "next/image";
import Link from "next/link";
import { addCatalogCartItem } from "@/app/catalogo/carrito/actions";
import { AddToCartSubmitButton } from "@/components/catalog/add-to-cart-submit-button";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type Props = {
  title: string;
  products: CatalogProductSummary[];
  initialCount?: number;
};

function MiniProductTile({
  product,
}: {
  product: CatalogProductSummary;
}) {
  const price = product.salePrice ?? 0;
  const regularPrice =
    product.regularPrice ?? null;
  const isOnOffer =
    regularPrice !== null &&
    regularPrice > price;
  const initial =
    product.name.trim().charAt(0).toUpperCase() ||
    "A";

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <Link
        href={`/catalogo/productos/${product.slug}`}
        className="block bg-zinc-50"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={260}
            height={260}
            unoptimized
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-pink-50 text-lg font-black text-pink-600">
            {initial}
          </div>
        )}
      </Link>

      <div className="space-y-2 p-2.5">
        <Link
          href={`/catalogo/productos/${product.slug}`}
          className="line-clamp-2 min-h-9 text-xs font-bold leading-tight text-zinc-950"
        >
          {product.name}
        </Link>
        <p className="text-sm font-black text-zinc-950">
          {isOnOffer && (
            <span className="mr-1 font-semibold text-zinc-400 line-through">
              L {regularPrice.toFixed(2)}
            </span>
          )}
          L {price.toFixed(2)}
        </p>
        <form action={addCatalogCartItem}>
          <input
            type="hidden"
            name="product_id"
            value={product.id}
          />
          <input
            type="hidden"
            name="quantity"
            value="1"
          />
          <AddToCartSubmitButton
            productName={product.name}
            optimisticItem={{
              productId: product.id,
              unitPrice: price,
              imageUrl: product.imageUrl,
            }}
          />
        </form>
      </div>
    </article>
  );
}

export function CatalogProductRail({
  title,
  products,
  initialCount = 8,
}: Props) {
  if (products.length === 0) {
    return null;
  }

  const initialProducts = products.slice(
    0,
    initialCount
  );
  const canExpand =
    products.length > initialCount;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>

      <div className="scrollbar-hidden flex snap-x gap-3 overflow-x-auto pb-1">
        {initialProducts.map((product) => (
          <div
            key={product.id}
            className="w-32 shrink-0 snap-start sm:w-44"
          >
            <MiniProductTile
              product={product}
            />
          </div>
        ))}
      </div>

      {canExpand && (
        <details
          className="group"
          data-animated-disclosure
        >
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-2xl border border-pink-100 bg-white px-5 text-sm font-bold text-pink-700 shadow-sm transition hover:bg-pink-50">
            Ver más productos
          </summary>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <MiniProductTile
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
