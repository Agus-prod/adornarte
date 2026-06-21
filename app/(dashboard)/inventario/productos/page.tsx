import Link from "next/link";
import { getProducts } from "@/lib/products/get-products";
import { ProductsTable } from "@/components/products/products-table";

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Productos
        </h1>

        <Link
          href="/inventario/productos/nuevo"
          className="rounded-xl bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          + Nuevo Producto
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}