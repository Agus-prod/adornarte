type Props = {
  query?: string;
  suggestions?: string[];
};

export function CatalogSearchForm({
  query = "",
  suggestions = [],
}: Props) {
  return (
    <form
      action="/catalogo/buscar"
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <input
        type="search"
        name="q"
        defaultValue={query}
        list="catalog-search-suggestions"
        placeholder="Buscar por producto, SKU, marca o atributo"
        className="min-h-11 flex-1 rounded-lg border px-4 text-sm"
      />

      <datalist id="catalog-search-suggestions">
        {suggestions.map((suggestion) => (
          <option
            key={suggestion}
            value={suggestion}
          />
        ))}
      </datalist>

      <button
        type="submit"
        className="min-h-11 rounded-lg bg-pink-600 px-5 text-sm font-semibold text-white hover:bg-pink-700"
      >
        Buscar
      </button>
    </form>
  );
}
