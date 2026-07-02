import { ProductForm } from "@/components/products/forms/product-form";
import { updateProduct } from "@/app/(dashboard)/inventario/productos/actions";
import { getBrands } from "@/lib/brands/get-brands";
import { getCategories } from "@/lib/categories/get-categories";
import { getProductById } from "@/lib/products/get-product-by-id";

type Props = {
  productId: string;
};

export async function ProductInfoCard({
  productId,
}: Props) {
  const product =
    await getProductById(productId);

  const categories =
    await getCategories();

  const brands =
    await getBrands();

  async function updateAction(
    formData: FormData
  ) {
    "use server";

    await updateProduct(
      productId,
      formData
    );
  }

  return (
    <ProductForm
      product={product}
      categories={categories}
      brands={brands}
      action={updateAction}
    />
  );
}
