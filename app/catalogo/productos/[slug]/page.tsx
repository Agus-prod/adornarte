import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogStructuredData } from "@/components/catalog/catalog-structured-data";
import { ProductAttributeList } from "@/components/catalog/product-attribute-list";
import { ProductShowcase } from "@/components/catalog/product-showcase";
import { ProductCombosSection } from "@/components/catalog/product-combos-section";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { ProductReviews } from "@/components/catalog/product-reviews";
import { BranchAvailability } from "@/components/catalog/branch-availability";
import { CatalogStorefrontHeader } from "@/components/catalog/catalog-storefront-header";
import {
  getCatalogProductDetailBySlug,
  getRelatedCatalogProducts,
} from "@/lib/catalog/services/catalog-service";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import {
  buildCatalogMetadata,
  buildProductSchema,
} from "@/lib/catalog/services/seo-service";
import { getProductReviews } from "@/lib/catalog/services/review-service";
import { getCatalogBranchAvailability } from "@/lib/catalog/services/branch-inventory-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

  const [
    relatedProducts,
    reviews,
    branchInventory,
    cart,
    customer,
  ] = await Promise.all([
    getRelatedCatalogProducts(
      organizationId,
      product.product.id
    ),
    getProductReviews(product.product.id),
    getCatalogBranchAvailability(
      product.product.id,
      organizationId
    ),
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);
  return (
    <main className="min-h-screen bg-[#fbfaf8]">
      <CatalogStorefrontHeader
        cart={cart}
        customer={customer}
        showBack
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <CatalogStructuredData
        data={buildProductSchema(product)}
      />

      <ProductShowcase product={product} />

      <ProductCombosSection
        product={product}
        products={relatedProducts}
      />

      <ProductAttributeList
        attributes={product.attributes}
      />

      <BranchAvailability
        inventory={branchInventory}
      />

      <RelatedProductsSection
        products={relatedProducts}
      />

      <ProductReviews
        productId={product.product.id}
        productSlug={product.slug}
        reviews={reviews}
      />
      </div>
    </main>
  );
}
