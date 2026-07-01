import { getCatalogProducts } from "../repositories/product-repository";
import { getDefaultVariant } from "../queries/get-product-variant";
import { getProductVariants } from "../queries/get-product-variants";

export async function getProduct(productId: string) {
  const products = await getCatalogProducts();

  const product = products.data?.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product;
}

export async function getProductWithDefaultVariant(productId: string) {
  const product = await getProduct(productId);

  const variant = await getDefaultVariant(productId);

  return {
    ...product,
    variant,
  };
}

export async function getCompleteProduct(productId: string) {
  const product = await getProduct(productId);

  const variants = await getProductVariants(productId);

  return {
    ...product,
    variants,
  };
}