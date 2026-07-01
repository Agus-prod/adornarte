import { getProductById } from "./get-product-by-id";
import { getProductVariants } from "@/lib/catalog/queries/get-product-variants";

export async function getCompleteProduct(
  productId: string
) {
  const product =
    await getProductById(productId);

  const variants =
    await getProductVariants(productId);

  return {
    product,
    variants,
  };
}