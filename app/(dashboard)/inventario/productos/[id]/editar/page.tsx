import { ProductEditor } from "@/components/products/product-editor";

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Editar Producto
      </h1>

      <ProductEditor
        productId={id}
        tab={tab}
      />
    </div>
  );
}
