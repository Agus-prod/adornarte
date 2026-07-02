import { ProductEditor } from "@/components/products/product-editor";

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

      <ProductEditor
        productId={id}
      />
    </div>
  );
}
