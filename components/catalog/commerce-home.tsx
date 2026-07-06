import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogDropdownCoordinator } from "@/components/catalog/catalog-dropdown-coordinator";
import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import { CatalogSearchForm } from "@/components/catalog/catalog-search-form";
import { CatalogRealtimeSync } from "@/components/catalog/catalog-realtime-sync";
import { MarketplaceCartPanel } from "@/components/catalog/marketplace-cart-panel";
import { CustomerAccessMenu } from "@/components/catalog/customer-access-menu";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";
import type {
  CatalogCartDetail,
  CatalogFilterOptions,
  CatalogHomeData,
  CatalogProductFilters,
  CatalogProductSummary,
  CatalogSettingsView,
} from "@/lib/catalog/types";

type Props = {
  home: CatalogHomeData;
  filterOptions: CatalogFilterOptions;
  filters: CatalogProductFilters;
  filteredProducts: CatalogProductSummary[];
  suggestions: string[];
  query: string;
  orderReceived?: boolean;
  settings: CatalogSettingsView;
  cart: CatalogCartDetail | null;
  customer: CatalogCustomer | null;
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

function hasDifferentProducts(
  baseProducts: CatalogProductSummary[],
  products: CatalogProductSummary[]
) {
  const baseIds = new Set(
    baseProducts.map((product) => product.id)
  );

  return products.some(
    (product) => !baseIds.has(product.id)
  );
}

function ProductSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: CatalogProductSummary[];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      <CatalogProductGrid
        products={products}
      />
    </section>
  );
}
function CartMenu({
  cart,
}: {
  cart: CatalogCartDetail | null;
}) {
  const itemCount =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <details
      className="group relative"
      data-catalog-menu
      data-catalog-cart-menu
    >
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-white px-3 py-2 text-pink-700 shadow-sm sm:px-4">
        <ShoppingBag
          className="size-4"
          aria-hidden="true"
        />
        <span className="hidden sm:inline">
          Carrito
        </span>
        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-bold">
          {itemCount}
        </span>
      </summary>
      <div
        data-dropdown-panel
        className="fixed inset-x-3 top-16 z-30 max-w-none sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)]"
      >
        <div
          data-cart-live-status
          hidden
          aria-live="polite"
          className="mb-2 rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 shadow-sm"
        />
        <MarketplaceCartPanel
          cart={cart}
          variant="dropdown"
        />
      </div>
    </details>
  );
}

export function CommerceHome({
  home,
  filterOptions,
  filters,
  filteredProducts,
  suggestions,
  query,
  orderReceived = false,
  settings,
  cart,
  customer,
}: Props) {
  const activeFilters =
    hasActiveFilters(filters, query);
  const heroProduct =
    home.heroProduct;
  const showFeatured =
    hasDifferentProducts(
      filteredProducts,
      home.featuredProducts
    );
  const showOffers =
    hasDifferentProducts(
      filteredProducts,
      home.offerProducts
    );

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogDropdownCoordinator />
      <CatalogRealtimeSync
        cartId={cart?.cart.id ?? null}
      />
      <section className="overflow-visible border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)] pt-20 sm:pt-16">
        <div className="fixed inset-x-0 top-0 z-50 border-b border-pink-100/70 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
          <Link
            href="/catalogo"
            className="min-w-0 truncate text-base font-black tracking-tight sm:text-lg"
          >
            AdornArte Shop
          </Link>
          <nav className="flex shrink-0 items-center gap-1 text-sm font-semibold sm:gap-2">
            <CustomerAccessMenu
              customer={customer}
            />
            <CartMenu
              cart={cart}
            />
          </nav>
        </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 px-3 py-8 sm:px-4 sm:py-10 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase text-pink-600 sm:text-sm">
                {settings.shopName}
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
                {settings.shopTagline ??
                  "Belleza lista para llevar"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:mt-4 sm:text-base">
                {settings.shopDescription ??
                  "Encuentra tus productos favoritos y compra en linea de forma facil."}
              </p>
            </div>

            <CatalogSearchForm
              query={query}
              suggestions={suggestions}
            />
          </div>

          <div className="rounded-2xl border border-pink-100 bg-white p-4 text-zinc-950 shadow-xl shadow-pink-100/60 sm:rounded-3xl sm:p-5">
            {heroProduct ? (
              <>
                <p className="text-sm font-semibold uppercase text-pink-600">
                  Disponible ahora
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {heroProduct.name}
                </h2>
                {heroProduct.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                    {heroProduct.description}
                  </p>
                )}
                <div className="mt-4 text-2xl font-bold sm:mt-5 sm:text-3xl">
                  L{" "}
                  {(heroProduct.salePrice ?? 0).toFixed(2)}
                </div>
                <Link
                  href={`/catalogo/productos/${heroProduct.slug}`}
                  className="mt-5 flex min-h-11 items-center justify-center rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Comprar producto
                </Link>
              </>
            ) : (
              <div className="py-10 text-center text-sm text-zinc-500">
                Sin productos publicados.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="space-y-8 sm:space-y-10">
        {orderReceived && (
          <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
            <div className="font-semibold text-pink-700">
              Pedido recibido
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Tu pedido quedo registrado. Puedes revisar el seguimiento en tu cuenta.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/catalogo/cuenta"
                className="inline-flex min-h-10 items-center rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Ver mis pedidos
              </Link>
              <Link
                href="/catalogo"
                className="inline-flex min-h-10 items-center rounded-2xl border border-pink-200 bg-white px-4 text-sm font-semibold text-pink-700 hover:bg-pink-50"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        )}

        <CatalogFilterPanel
          filters={filters}
          options={filterOptions}
        />

        <ProductSection
          title={
            activeFilters
              ? "Resultados"
              : "Comprar ahora"
          }
          subtitle={
            activeFilters
              ? "Productos que coinciden con tu busqueda."
              : "Estos productos ya estan listos para agregarse al carrito."
          }
          products={filteredProducts}
        />

        {!activeFilters && (
          <>
          {showFeatured && (
            <ProductSection
              title="Destacados"
              subtitle="Productos marcados para mostrarse primero."
              products={home.featuredProducts}
            />
          )}

          {showOffers && (
            <ProductSection
              title="Ofertas"
              subtitle="Productos con precio promocional publicado."
              products={home.offerProducts}
            />
          )}

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
                    className="rounded-lg border border-zinc-200 bg-white p-5"
                    >
                      <h3 className="font-semibold">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="mt-2 text-sm text-zinc-500">
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

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {home.brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/catalogo?brandId=${brand.id}`}
                    className="group flex min-h-36 flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/60"
                  >
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="h-16 max-w-32 object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex size-16 items-center justify-center rounded-full bg-pink-50 text-xl font-black text-pink-600">
                        {brand.name
                          .trim()
                          .charAt(0)
                          .toUpperCase() || "M"}
                      </span>
                    )}
                    <span className="mt-4 text-sm font-bold text-zinc-900 group-hover:text-pink-700">
                      {brand.name}
                    </span>
                    {brand.description && (
                      <span className="mt-1 line-clamp-2 text-xs text-zinc-500">
                        {brand.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
          </>
        )}
        </div>

      </div>
    </main>
  );
}
