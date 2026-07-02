import type {
  CatalogFilterOptions,
  CatalogProductFilters,
} from "@/lib/catalog/types";

type Props = {
  filters: CatalogProductFilters;
  options: CatalogFilterOptions;
};

export function CatalogFilterPanel({
  filters,
  options,
}: Props) {
  return (
    <form
      action="/catalogo"
      className="grid gap-3 border-y bg-white py-4 md:grid-cols-4"
    >
      <select
        name="brandId"
        defaultValue={filters.brandId ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      >
        <option value="">Marca</option>
        {options.brands.map((brand) => (
          <option
            key={brand.id}
            value={brand.id}
          >
            {brand.name}
          </option>
        ))}
      </select>

      <select
        name="categoryId"
        defaultValue={filters.categoryId ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      >
        <option value="">Categoria</option>
        {options.categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <select
        name="color"
        defaultValue={filters.color ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      >
        <option value="">Color</option>
        {options.colors.map((color) => (
          <option
            key={color}
            value={color}
          >
            {color}
          </option>
        ))}
      </select>

      <select
        name="tone"
        defaultValue={filters.tone ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      >
        <option value="">Tono</option>
        {options.tones.map((tone) => (
          <option
            key={tone}
            value={tone}
          >
            {tone}
          </option>
        ))}
      </select>

      <select
        name="finish"
        defaultValue={filters.finish ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      >
        <option value="">Acabado</option>
        {options.finishes.map((finish) => (
          <option
            key={finish}
            value={finish}
          >
            {finish}
          </option>
        ))}
      </select>

      <input
        name="minPrice"
        type="number"
        min="0"
        step="0.01"
        placeholder="Precio minimo"
        defaultValue={filters.minPrice ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      />

      <input
        name="maxPrice"
        type="number"
        min="0"
        step="0.01"
        placeholder="Precio maximo"
        defaultValue={filters.maxPrice ?? ""}
        className="min-h-11 rounded-lg border px-3 text-sm"
      />

      <div className="flex min-h-11 items-center gap-4 rounded-lg border px-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={
              filters.inStock ?? false
            }
          />
          Stock
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="onOffer"
            defaultChecked={
              filters.onOffer ?? false
            }
          />
          Oferta
        </label>
      </div>

      <button
        type="submit"
        className="min-h-11 rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
      >
        Filtrar
      </button>
    </form>
  );
}
