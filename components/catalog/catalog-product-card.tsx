import Image from "next/image";
import Link from "next/link";
import { addCatalogCartItem } from "@/app/catalogo/carrito/actions";
import { AddToCartSubmitButton } from "@/components/catalog/add-to-cart-submit-button";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type Props = {
  product: CatalogProductSummary;
};

export function CatalogProductCard({
  product,
}: Props) {
  const price =
    product.salePrice ?? 0;
  const regularPrice =
    product.regularPrice ?? null;
  const isOnOffer =
    regularPrice !== null &&
    regularPrice > price;
  const initial =
    product.name.trim().charAt(0).toUpperCase() ||
    "A";

  return (
    <article className="group grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/60 sm:flex sm:h-full sm:flex-col sm:rounded-3xl">
      <Link
        href={`/catalogo/productos/${product.slug}`}
        className="relative block overflow-hidden bg-zinc-50"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={480}
            height={480}
            unoptimized
            className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-square h-full flex-col items-center justify-center bg-zinc-50 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-pink-600 text-2xl font-bold text-white shadow-lg shadow-pink-200">
              {initial}
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-500">
              Producto disponible
            </div>
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm">
            Destacado
          </span>
        )}
        {isOnOffer && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Oferta
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-h-6 min-w-0 text-base font-semibold leading-tight">
            <Link
              href={`/catalogo/productos/${product.slug}`}
              className="hover:text-pink-600"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        {product.description && (
          <p className="hidden min-h-10 text-sm text-zinc-500 sm:line-clamp-2 sm:block">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          {isOnOffer &&
            regularPrice !== null && (
            <div className="text-sm font-semibold text-zinc-400 line-through">
              L {regularPrice.toFixed(2)}
            </div>
          )}
          <div className="text-lg font-bold text-zinc-950 sm:text-xl">
            L {price.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <form
            action={addCatalogCartItem}
            className="min-w-0"
          >
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

          <Link
            href={`/catalogo/productos/${product.slug}`}
            className="flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:border-pink-200 hover:text-pink-700 sm:rounded-2xl"
          >
            Ver
          </Link>
        </div>
      </div>
    </article>
  );
}
