import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/catalog/add-to-cart-form";
import { CatalogStructuredData } from "@/components/catalog/catalog-structured-data";
import { ProductAttributeList } from "@/components/catalog/product-attribute-list";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductVariantList } from "@/components/catalog/product-variant-list";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { WishlistButton } from "@/components/catalog/wishlist-button";
import {
  getCatalogProductDetailBySlug,
  getRelatedCatalogProducts,
} from "@/lib/catalog/services/catalog-service";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import {
  buildCatalogMetadata,
  buildProductSchema,
} from "@/lib/catalog/services/seo-service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatMoney(
  value: number | null
) {
  return `L ${(value ?? 0).toFixed(2)}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    return buildCatalogMetadata({
      title: "Producto",
      description: null,
    });
  }

  const { slug } = await params;
  const product =
    await getCatalogProductDetailBySlug(
      organizationId,
      slug
    );

  if (!product) {
    return buildCatalogMetadata({
      title: "Producto",
      description: null,
    });
  }

  return buildCatalogMetadata({
    title: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    seo: product.seo,
  });
}

export default async function CatalogProductPage({
  params,
}: PageProps) {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    notFound();
  }

  const { slug } = await params;
  const product =
    await getCatalogProductDetailBySlug(
      organizationId,
      slug
    );

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await getRelatedCatalogProducts(
      organizationId,
      product.product.id
    );
  const primaryStock =
    product.variants.find(
      (variant) => variant.is_default
    )?.stock ?? product.product.stock ?? 0;

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <CatalogStructuredData
        data={buildProductSchema(product)}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <ProductGallery
          productName={product.name}
          fallbackImageUrl={
            product.imageUrl
          }
          images={product.images}
        />

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="mt-4 text-2xl font-bold text-pink-600">
              {formatMoney(
                product.salePrice
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">
              Disponibilidad
            </div>
            <div className="mt-1 font-semibold">
              {primaryStock > 0
                ? `${primaryStock} disponibles`
                : "Sin stock"}
            </div>
          </div>

          {product.description && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">
                Descripcion
              </h2>
              <p className="text-gray-600">
                {product.description}
              </p>
            </section>
          )}

          <ProductVariantList
            variants={product.variants}
          />

          <AddToCartForm
            product={product}
          />

          <WishlistButton
            productId={product.product.id}
          />
        </div>
      </div>

      <ProductAttributeList
        attributes={product.attributes}
      />

      <RelatedProductsSection
        products={relatedProducts}
      />
    </main>
  );
}
