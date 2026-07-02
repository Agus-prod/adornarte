import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  variant?: ProductVariant;
};

export function VariantForm({
  action,
  submitLabel,
  variant,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>

          <input
            name="name"
            required
            defaultValue={variant?.name ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            SKU
          </label>

          <input
            name="sku"
            defaultValue={variant?.sku ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Código de barras
          </label>

          <input
            name="barcode"
            defaultValue={variant?.barcode ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            defaultValue={variant?.stock ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Costo
          </label>

          <input
            type="number"
            step="0.01"
            name="cost_price"
            defaultValue={variant?.cost_price ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Precio venta
          </label>

          <input
            type="number"
            step="0.01"
            name="sale_price"
            defaultValue={variant?.sale_price ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={variant?.active ?? true}
            className="h-4 w-4"
          />

          Activa
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_default"
            defaultChecked={variant?.is_default ?? false}
            className="h-4 w-4"
          />

          Predeterminada
        </label>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
