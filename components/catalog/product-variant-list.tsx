import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";

type Props = {
  variants: ProductVariant[];
};

function formatMoney(value: number) {
  return `L ${value.toFixed(2)}`;
}

export function ProductVariantList({
  variants,
}: Props) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        Variantes
      </h2>

      <div className="grid gap-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <div className="font-medium">
                {variant.name}
              </div>
              <div className="text-sm text-gray-500">
                Stock {variant.stock}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-pink-600">
                {formatMoney(
                  variant.sale_price
                )}
              </div>
              {variant.is_default && (
                <div className="text-xs text-gray-500">
                  Predeterminada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
