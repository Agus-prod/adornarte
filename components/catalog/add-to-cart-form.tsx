import { addCatalogCartItem } from "@/app/catalogo/carrito/actions";
import { AddToCartSubmitButton } from "@/components/catalog/add-to-cart-submit-button";
import type { CatalogProductDetail } from "@/lib/catalog/types";

type Props = {
  product: CatalogProductDetail;
};

export function AddToCartForm({
  product,
}: Props) {
  const defaultVariant =
    product.variants.find(
      (variant) => variant.is_default
    ) ?? product.variants[0];

  return (
    <form
      action={addCatalogCartItem}
      className="space-y-4 rounded-lg border p-4"
    >
      <input
        type="hidden"
        name="product_id"
        value={product.product.id}
      />

      {product.variants.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Variante
          </label>
          <select
            name="variant_id"
            defaultValue={
              defaultVariant?.id ?? ""
            }
            className="min-h-11 w-full rounded-lg border px-3 text-sm"
          >
            {product.variants.map(
              (variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                >
                  {variant.name}
                </option>
              )
            )}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Cantidad
        </label>
        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          className="min-h-11 w-full rounded-lg border px-3 text-sm"
        />
      </div>

      <textarea
        name="notes"
        rows={2}
        placeholder="Notas"
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="sr-only"
      />
      <AddToCartSubmitButton
        productName={product.name}
        optimisticItem={{
          productId: product.product.id,
          variantId:
            defaultVariant?.id ?? null,
          unitPrice:
            defaultVariant?.sale_price ??
            product.salePrice ??
            0,
          imageUrl: product.imageUrl,
        }}
      />
    </form>
  );
}
