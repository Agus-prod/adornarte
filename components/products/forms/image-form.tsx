import type { ProductImage } from "@/lib/catalog/repositories/image-repository";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  image?: ProductImage;
  mode: "create" | "edit";
};

export function ImageForm({
  action,
  submitLabel,
  image,
  mode,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-4"
    >
      {mode === "create" && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Imagen
          </label>

          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            required
            className="w-full rounded-xl border p-3"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Texto alternativo
          </label>

          <input
            name="alt_text"
            defaultValue={image?.alt_text ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Orden
          </label>

          <input
            type="number"
            name="sort_order"
            defaultValue={image?.sort_order ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="is_primary"
          defaultChecked={image?.is_primary ?? false}
          className="h-4 w-4"
        />

        Imagen principal
      </label>

      <button
        type="submit"
        className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
