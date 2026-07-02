import { ProductInfoCard } from "@/components/products/cards/product-info-card";
import { ProductVariantsCard } from "@/components/products/variants-card";
import { getCompleteProduct } from "@/lib/catalog/services/product-service";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const catalogProduct =
    await getCompleteProduct(id);

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Editar Producto
      </h1>

      <ProductInfoCard
        productId={id}
      />

      <div className="mt-8">
        <ProductVariantsCard
          productId={id}
          variants={catalogProduct.variants}
        />
      </div>
    </div>
  );
}
