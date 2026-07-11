import { createProduct } from "../actions";
import { NewProductCompleteForm } from "@/components/products/forms/new-product-complete-form";
import { getBrands } from "@/lib/brands/get-brands";
import { getCategories } from "@/lib/categories/get-categories";

export default async function NuevoProductoPage() {
  const [categories, brands] =
    await Promise.all([
      getCategories(),
      getBrands(),
    ]);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Nuevo Producto
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Crea el producto con variantes, imagenes, atributos y publicacion inicial en una sola pantalla.
        </p>
      </div>

      <NewProductCompleteForm
        categories={categories}
        brands={brands}
        action={createProduct}
      />
    </div>
  );
}
