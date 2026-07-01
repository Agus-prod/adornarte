import { DataCard } from "@/components/ui/data-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";

type Props = {
  productId: string;
  variants: ProductVariant[];
};

export function ProductVariantsCard({
  productId,
  variants,
}: Props) {
  return (
    <DataCard>

      <div className="flex items-center justify-between border-b px-6 py-4">

        <div>

          <h2 className="text-lg font-semibold">
            Variantes
          </h2>

          <p className="text-sm text-muted-foreground">
            Tonos, colores y presentaciones del producto.
          </p>

        </div>

        <Button>
          Nueva variante
        </Button>

      </div>

      <div className="p-6">

        {variants.length === 0 ? (

          <EmptyState
            title="Este producto no tiene variantes"
            description="Crea la primera variante para comenzar a vender este producto."
          />

        ) : (

          <div className="space-y-3">

            {variants.map((variant) => (

              <div
                key={variant.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >

                <div>

                  <div className="font-medium">
                    {variant.name}
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground">

                    SKU: {variant.sku ?? "-"}

                    {" • "}

                    Stock: {variant.stock}

                    {" • "}

                    L {Number(variant.sale_price).toFixed(2)}

                  </div>

                </div>

                {variant.is_default && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Principal
                  </span>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </DataCard>
  );
}