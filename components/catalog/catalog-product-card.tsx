import Image from "next/image";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type Props = {
  product: CatalogProductSummary;
};

export function CatalogProductCard({
  product,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={480}
          height={480}
          unoptimized
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-gray-50 text-sm text-gray-400">
          Sin imagen
        </div>
      )}

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold">
            {product.name}
          </h3>

          {product.isFeatured && (
            <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
              Destacado
            </span>
          )}
        </div>

        {product.description && (
          <p className="line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        )}

        <div className="font-semibold text-pink-600">
          L {(product.salePrice ?? 0).toFixed(2)}
        </div>
      </div>
    </article>
  );
}
