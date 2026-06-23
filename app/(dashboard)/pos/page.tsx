import { getProducts } from "@/lib/products/get-products";
import { PosClient } from "@/components/pos/pos-client";
import { getCustomers } from "@/lib/customers/get-customers";

export default async function PosPage() {
  const products =
    await getProducts();

  const customers =
    await getCustomers();
    console.log(
  "CLIENTES:",
  customers
);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Punto de Venta
        </h1>

        <p className="text-gray-500">
          Crear una nueva venta.
        </p>
      </div>

      <PosClient
  products={products ?? []}
  customers={customers ?? []}
/>
</div>
  );
}