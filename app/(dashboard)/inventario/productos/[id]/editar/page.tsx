import { ProductInfoCard } from "@/components/products/cards/product-info-card";
import { ProductVariantsCard } from "@/components/products/cards/product-variants-card";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
        />
      </div>
    </div>
  );
}
