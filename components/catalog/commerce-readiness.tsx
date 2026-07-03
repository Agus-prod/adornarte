import type { CatalogReadinessItem } from "@/lib/catalog/types";

type Props = {
  items: CatalogReadinessItem[];
};

export function CommerceReadiness({
  items,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-lg border bg-white p-4"
        >
          <span className="font-medium">
            {item.label}
          </span>
          <span
            className={
              item.ready
                ? "text-sm font-semibold text-green-600"
                : "text-sm font-semibold text-gray-400"
            }
          >
            {item.ready
              ? "Listo"
              : "Pendiente"}
          </span>
        </div>
      ))}
    </div>
  );
}
