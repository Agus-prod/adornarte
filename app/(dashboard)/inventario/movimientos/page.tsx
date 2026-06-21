import { getProducts } from "@/lib/products/get-products";
import { StockMovementForm } from "@/components/stock/stock-movement-form";
import { getStockMovements } from "@/lib/stock/get-stock-movements";
import { StockMovementsTable } from "@/components/stock/stock-movements-table";

export default async function MovimientosPage() {
  const products =
    await getProducts();
    const movements =
  await getStockMovements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Movimientos de Inventario
        </h1>

        <p className="mt-2 text-gray-500">
          Entradas, salidas y ajustes.
        </p>
      </div>

      <StockMovementForm
        products={products}
      />
      <StockMovementsTable
  movements={movements}
/>
    </div>
  );
}