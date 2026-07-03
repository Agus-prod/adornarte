import type { CatalogBranchInventory } from "@/lib/catalog/repositories/branch-inventory-repository";

type Item = CatalogBranchInventory & {
  available: number;
};

type Props = {
  inventory: Item[];
};

export function BranchAvailability({
  inventory,
}: Props) {
  if (inventory.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        Disponibilidad por sucursal
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-3"
          >
            <div className="text-sm text-gray-500">
              Sucursal
            </div>
            <div className="font-semibold">
              {item.available} disponibles
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
