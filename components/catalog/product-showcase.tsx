"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { addCatalogCartItem } from "@/app/catalogo/carrito/actions";
import { addWishlistItem } from "@/app/catalogo/wishlist/actions";
import { AddToCartSubmitButton } from "@/components/catalog/add-to-cart-submit-button";
import type { ProductImage } from "@/lib/catalog/repositories/image-repository";
import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";
import type { CatalogProductDetail } from "@/lib/catalog/types";

type GalleryImage = Pick<
  ProductImage,
  "id" | "url" | "alt_text" | "is_primary"
>;

type Props = {
  product: CatalogProductDetail;
};

function formatMoney(value: number | null) {
  return `L ${(value ?? 0).toFixed(2)}`;
}

function normalizeMatch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getVariantImage(
  variant: ProductVariant,
  images: GalleryImage[]
) {
  const variantKey = normalizeMatch(
    variant.name
  );

  return images.find((image) => {
    const imageText = normalizeMatch(
      [
        image.alt_text ?? "",
        image.url,
      ].join(" ")
    );

    return imageText.includes(variantKey);
  });
}

function getVariantToneStyle(name: string) {
  const colors: Record<string, string> = {
    rojo: "#c1121f",
    red: "#c1121f",
    rosa: "#f472b6",
    pink: "#f472b6",
    nude: "#c79b7b",
    cafe: "#7f5539",
    brown: "#7f5539",
    vino: "#7b1e3a",
    berry: "#7b1e3a",
    morado: "#7c3aed",
    purple: "#7c3aed",
    negro: "#111827",
    black: "#111827",
    blanco: "#f8fafc",
    white: "#f8fafc",
  };
  const normalized = normalizeMatch(name);
  const matchedKey = Object.keys(colors).find(
    (key) => normalized.includes(key)
  );

  if (matchedKey) {
    return colors[matchedKey];
  }

  let hash = 0;
  for (const char of normalized) {
    hash =
      (hash * 31 + char.charCodeAt(0)) %
      360;
  }

  return `hsl(${hash} 68% 58%)`;
}

function buildImages(
  product: CatalogProductDetail
): GalleryImage[] {
  if (product.images.length > 0) {
    return product.images;
  }

  if (!product.imageUrl) {
    return [];
  }

  return [
    {
      id: product.imageUrl,
      url: product.imageUrl,
      alt_text: product.name,
      is_primary: true,
    },
  ];
}

export function ProductShowcase({
  product,
}: Props) {
  const images = useMemo(
    () => buildImages(product),
    [product]
  );
  const defaultVariant =
    product.variants.find(
      (variant) => variant.is_default
    ) ?? product.variants[0] ?? null;
  const [selectedVariantId, setSelectedVariantId] =
    useState(defaultVariant?.id ?? "");
  const [selectedImageId, setSelectedImageId] =
    useState(
      images.find((image) => image.is_primary)
        ?.id ??
        images[0]?.id ??
        ""
    );
  const selectedVariant =
    product.variants.find(
      (variant) =>
        variant.id === selectedVariantId
    ) ?? defaultVariant;
  const variantImage =
    selectedVariant
      ? getVariantImage(
          selectedVariant,
          images
        )
      : undefined;
  const selectedImage =
    variantImage ??
    images.find(
      (image) => image.id === selectedImageId
    ) ??
    images[0];
  const selectedPrice =
    selectedVariant?.sale_price ??
    product.salePrice;
  const selectedRegularPrice =
    selectedVariant
      ? null
      : product.regularPrice;
  const isOnOffer =
    selectedRegularPrice !== null &&
    selectedPrice !== null &&
    selectedRegularPrice > selectedPrice;
  const selectedStock =
    selectedVariant?.stock ??
    product.product.stock ??
    0;

  function selectVariant(variant: ProductVariant) {
    setSelectedVariantId(variant.id);
    const image = getVariantImage(
      variant,
      images
    );

    if (image) {
      setSelectedImageId(image.id);
    }
  }

  return (
    <div className="grid gap-6 rounded-[2rem] bg-white p-3 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="space-y-3">
        <div className="overflow-hidden rounded-[1.5rem] border border-zinc-100 bg-white sm:rounded-[2rem]">
          {selectedImage ? (
            <Image
              src={selectedImage.url}
              alt={
                selectedImage.alt_text ??
                product.name
              }
              width={1000}
              height={1000}
              priority
              unoptimized
              className="aspect-square w-full object-contain p-3 sm:p-5"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-zinc-400">
              Sin imagen
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="scrollbar-hidden flex gap-3 overflow-x-auto pb-1">
            {images.map((image) => {
              const active =
                image.id === selectedImage?.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImageId(
                      image.id
                    )
                  }
                  aria-label={`Ver imagen ${image.alt_text ?? product.name}`}
                  className={
                    active
                      ? "size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-pink-600 bg-white shadow-sm sm:size-24"
                      : "size-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-pink-300 sm:size-24"
                  }
                >
                  <Image
                    src={image.url}
                    alt={
                      image.alt_text ??
                      product.name
                    }
                    width={180}
                    height={180}
                    unoptimized
                    className="size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-5 rounded-[1.5rem] bg-pink-50/50 p-4 sm:rounded-[2rem] sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
            Producto destacado
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-4">
            {isOnOffer && (
              <div className="text-sm font-semibold text-zinc-400 line-through">
                {formatMoney(
                  selectedRegularPrice
                )}
              </div>
            )}
            <div className="text-2xl font-bold text-pink-600">
              {formatMoney(selectedPrice)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-4">
          <div className="text-sm text-gray-500">
            Disponibilidad
          </div>
          <div className="mt-1 font-semibold">
            {selectedStock > 0
              ? `${selectedStock} disponibles`
              : "Sin stock"}
          </div>
        </div>

        {product.description && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">
              Descripcion
            </h2>
            <p className="text-sm leading-6 text-gray-600 sm:text-base">
              {product.description}
            </p>
          </section>
        )}

        {product.variants.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  Color o tono
                </h2>
                <p className="text-sm text-zinc-500">
                  Elige una variante para ver precio, stock e imagen.
                </p>
              </div>
              {selectedVariant && (
                <span className="text-sm font-semibold text-pink-700">
                  {selectedVariant.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {product.variants.map((variant) => {
                const active =
                  variant.id ===
                  selectedVariant?.id;
                const tone =
                  getVariantToneStyle(
                    variant.name
                  );

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() =>
                      selectVariant(variant)
                    }
                    className={
                      active
                        ? "flex min-h-14 items-center gap-2 rounded-2xl border-2 border-pink-600 bg-white px-3 text-left text-sm font-bold shadow-sm"
                        : "flex min-h-14 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 text-left text-sm font-semibold transition hover:border-pink-300"
                    }
                  >
                    <span
                      className="size-6 shrink-0 rounded-full border border-zinc-200"
                      style={{
                        background: tone,
                      }}
                    />
                    <span className="min-w-0">
                      <span className="block truncate">
                        {variant.name}
                      </span>
                      <span className="block text-xs font-normal text-zinc-500">
                        {formatMoney(
                          variant.sale_price
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <form
          action={addCatalogCartItem}
          className="space-y-4 rounded-2xl border border-pink-100 bg-white p-4"
        >
          <input
            type="hidden"
            name="product_id"
            value={product.product.id}
          />
          {selectedVariant && (
            <input
              type="hidden"
              name="variant_id"
              value={selectedVariant.id}
            />
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Cantidad
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              max={
                selectedStock > 0
                  ? selectedStock
                  : undefined
              }
              defaultValue="1"
              className="min-h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm"
            />
          </div>

          <textarea
            name="notes"
            rows={2}
            placeholder="Notas"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          />

          <AddToCartSubmitButton
            productName={product.name}
            optimisticItem={{
              productId: product.product.id,
              variantId:
                selectedVariant?.id ?? null,
              unitPrice:
                Number(selectedPrice ?? 0),
              imageUrl:
                selectedImage?.url ??
                product.imageUrl,
            }}
          />
        </form>

        <form action={addWishlistItem}>
          <input
            type="hidden"
            name="product_id"
            value={product.product.id}
          />
          <button
            type="submit"
            className="min-h-11 w-full rounded-2xl border border-pink-100 bg-white px-4 text-sm font-semibold transition hover:bg-pink-50"
          >
            Agregar a favoritos
          </button>
        </form>
      </section>
    </div>
  );
}
