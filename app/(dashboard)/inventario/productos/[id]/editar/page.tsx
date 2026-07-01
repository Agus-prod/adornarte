import { ProductForm } from "@/components/products/forms/product-form";
import { ProductVariantsCard } from "@/components/products/variants-card";
import { updateProduct } from "@/app/(dashboard)/inventario/productos/actions";
import { getBrands } from "@/lib/brands/get-brands";
import { getCategories } from "@/lib/categories/get-categories";
import { getCompleteProduct } from "@/lib/catalog/services/product-service";
import { getProductById } from "@/lib/products/get-product-by-id";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product =
    await getProductById(id);

  const catalogProduct =
    await getCompleteProduct(id);

  const categories =
    await getCategories();

  const brands =
    await getBrands();

  async function updateAction(
    formData: FormData
  ) {
    "use server";

    await updateProduct(
      id,
      formData
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Editar Producto
      </h1>

      <ProductForm
        product={product}
        categories={categories}
        brands={brands}
        action={updateAction}
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
