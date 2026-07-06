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
      className="flex w-full flex-col gap-2 rounded-2xl bg-white/80 p-2 shadow-sm ring-1 ring-pink-100 sm:flex-row sm:rounded-3xl"
    >
      <input
        type="search"
        name="q"
        defaultValue={query}
        list="catalog-search-suggestions"
        placeholder="Buscar por producto, SKU, marca o atributo"
        className="min-h-11 min-w-0 flex-1 rounded-2xl border border-transparent bg-white px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
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
        className="min-h-11 rounded-2xl bg-pink-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 sm:w-auto"
      >
        Buscar
      </button>
    </form>
  );
}
