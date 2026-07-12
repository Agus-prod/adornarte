import { InventoryCountClient } from "@/components/inventory/inventory-count-client";
import { getProducts } from "@/lib/products/get-products";

export default async function ConteoInventarioPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Conteo de Inventario
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Escanea lo que hay fisicamente en tienda y compara contra el stock del sistema.
        </p>
      </div>

      <InventoryCountClient
        products={products}
      />
    </div>
  );
}
