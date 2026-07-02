import Image from "next/image";
import Link from "next/link";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import { CatalogSearchForm } from "@/components/catalog/catalog-search-form";
import type {
  CatalogFilterOptions,
  CatalogHomeData,
  CatalogProductFilters,
  CatalogProductSummary,
} from "@/lib/catalog/types";

type Props = {
  home: CatalogHomeData;
  filterOptions: CatalogFilterOptions;
  filters: CatalogProductFilters;
  filteredProducts: CatalogProductSummary[];
  suggestions: string[];
  query: string;
};

function hasActiveFilters(
  filters: CatalogProductFilters,
  query: string
) {
  return (
    Boolean(query) ||
    Object.values(filters).some(
      (value) =>
        value !== undefined &&
        value !== false &&
        value !== ""
    )
  );
}

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: CatalogProductSummary[];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">
        {title}
      </h2>

      <CatalogProductGrid
        products={products}
      />
    </section>
  );
}

export function CommerceHome({
  home,
  filterOptions,
  filters,
  filteredProducts,
  suggestions,
  query,
}: Props) {
  const activeFilters =
    hasActiveFilters(filters, query);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <section className="grid min-h-[24rem] overflow-hidden rounded-lg border bg-white lg:grid-cols-[1fr_28rem]">
        <div className="flex flex-col justify-center gap-6 p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
              AdornArte Commerce
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Maquillaje listo para comprar
            </h1>
            <p className="mt-4 max-w-2xl text-gray-600">
              Explora productos, colecciones, marcas y ofertas publicadas desde el catalogo.
            </p>
          </div>

          <CatalogSearchForm
            query={query}
            suggestions={suggestions}
          />
        </div>

        {home.heroProduct?.imageUrl ? (
          <Link
            href={`/catalogo/productos/${home.heroProduct.slug}`}
            className="relative min-h-80"
          >
            <Image
              src={home.heroProduct.imageUrl}
              alt={home.heroProduct.name}
              fill
              unoptimized
              className="object-cover"
            />
          </Link>
        ) : (
          <div className="flex min-h-80 items-center justify-center bg-gray-50 text-gray-400">
            Catalogo
          </div>
        )}
      </section>

      <CatalogFilterPanel
        filters={filters}
        options={filterOptions}
      />

      {activeFilters ? (
        <ProductSection
          title="Resultados"
          products={filteredProducts}
        />
      ) : (
        <>
          <ProductSection
            title="Destacados"
            products={home.featuredProducts}
          />

          <ProductSection
            title="Novedades"
            products={home.newProducts}
          />

          <ProductSection
            title="Ofertas"
            products={home.offerProducts}
          />

          {home.collections.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Colecciones
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                {home.collections.map(
                  (collection) => (
                    <div
                      key={collection.id}
                      className="rounded-lg border bg-white p-5"
                    >
                      <h3 className="font-semibold">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="mt-2 text-sm text-gray-500">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {home.brands.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Marcas
              </h2>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {home.brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-lg border bg-white p-4 text-center text-sm font-semibold"
                  >
                    {brand.name}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
