import type { ProductAttribute } from "@/lib/catalog/repositories/attribute-repository";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  attribute?: ProductAttribute;
};

const attributeTypes = [
  {
    value: "color",
    label: "Color",
  },
  {
    value: "tone",
    label: "Tono",
  },
  {
    value: "finish",
    label: "Acabado",
  },
  {
    value: "coverage",
    label: "Cobertura",
  },
  {
    value: "spf",
    label: "SPF",
  },
  {
    value: "size",
    label: "Tamaño",
  },
  {
    value: "weight",
    label: "Peso",
  },
  {
    value: "content",
    label: "Contenido",
  },
  {
    value: "custom",
    label: "Dinámico",
  },
];

export function AttributeForm({
  action,
  submitLabel,
  attribute,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Tipo
          </label>

          <select
            name="type"
            defaultValue={attribute?.type ?? "custom"}
            className="w-full rounded-xl border p-3"
          >
            {attributeTypes.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>

          <input
            name="name"
            required
            defaultValue={attribute?.name ?? ""}
            placeholder="Color, Tono, SPF..."
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor
          </label>

          <input
            name="value"
            required
            defaultValue={attribute?.value ?? ""}
            placeholder="Rojo, Mate, Alta..."
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
            defaultValue={attribute?.sort_order ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>
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
