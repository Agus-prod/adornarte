import Link from "next/link";
import {
  Search,
  ShoppingBag,
} from "lucide-react";
import { AdornarteBrandMark } from "@/components/brand/adornarte-brand-mark";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogDropdownCoordinator } from "@/components/catalog/catalog-dropdown-coordinator";
import { CatalogComboRail } from "@/components/catalog/catalog-combo-rail";
import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import { CatalogProductRail } from "@/components/catalog/catalog-product-rail";
import { CatalogSearchForm } from "@/components/catalog/catalog-search-form";
import { CatalogRealtimeSync } from "@/components/catalog/catalog-realtime-sync";
import { CatalogCartMenuController } from "@/components/catalog/catalog-cart-menu-controller";
import { HorizontalDragScroll } from "@/components/catalog/horizontal-drag-scroll";
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

type CatalogHomeBrand =
  CatalogHomeData["brands"][number];

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

function normalizeBrandName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getBrandWordmark(name: string) {
  const wordmarks: Record<string, string> = {
    maybelline: "MAYBELLINE",
    lorealparis: "L'OREAL PARIS",
    nyxprofessionalmakeup: "NYX",
    elfcosmetics: "e.l.f.",
    milani: "MILANI",
    wetnwild: "wet n wild",
    essence: "essence",
    catrice: "CATRICE",
    revlon: "REVLON",
    covergirl: "COVERGIRL",
    lagirl: "L.A. GIRL",
  };
  const key = normalizeBrandName(name);

  return wordmarks[key] ?? name;
}

function getBrandLogoUrl(
  brand: CatalogHomeBrand
) {
  const fallbackLogos: Record<string, string> = {
    maybelline:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Maybelline-Logo.svg",
    lorealparis:
      "https://commons.wikimedia.org/wiki/Special:FilePath/L%27Or%C3%A9al_logo.svg",
    nyxprofessionalmakeup:
      "https://commons.wikimedia.org/wiki/Special:FilePath/NYX_Professional_Makeup_Logo.jpeg",
  };
  const key = normalizeBrandName(
    brand.name
  );

  if (
    brand.logo_url &&
    !brand.logo_url.includes(
      "adornarte-logo"
    )
  ) {
    return brand.logo_url;
  }

  return fallbackLogos[key] ?? null;
}

function BrandWordmark({
  name,
}: {
  name: string;
}) {
  return (
    <span className="flex h-14 min-w-28 items-center justify-center px-5 text-center text-sm font-black tracking-wide text-zinc-300 transition duration-300 group-hover:text-zinc-950 sm:min-w-36 sm:text-base">
      {getBrandWordmark(name)}
    </span>
  );
}

function BrandMarquee({
  brands,
}: {
  brands: CatalogHomeBrand[];
}) {
  const publicBrands = brands.filter(
    (brand) =>
      normalizeBrandName(brand.name) !==
      "generica"
  );

  if (publicBrands.length === 0) {
    return null;
  }

  return (
    <section
      id="marcas"
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Marcas
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Compra por tus marcas favoritas.
        </p>
      </div>

      <div className="relative overflow-hidden border-y border-pink-100 bg-white py-7 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="catalog-brand-marquee flex w-max items-center">
          {[0, 1].map((loop) => (
            <div
              key={loop}
              className="flex min-w-max shrink-0 items-center gap-16 pr-16 sm:gap-28 sm:pr-28"
              aria-hidden={loop === 1}
            >
              {publicBrands.map((brand) => {
                const logoUrl =
                  getBrandLogoUrl(brand);

                return (
                  <Link
                    key={`${brand.id}-${loop}`}
                    href={`/catalogo?brandId=${brand.id}`}
                    className="group flex min-w-36 shrink-0 items-center justify-center sm:min-w-56"
                    aria-label={`Ver productos de ${brand.name}`}
                    tabIndex={
                      loop === 1 ? -1 : 0
                    }
                  >
                    {logoUrl ? (
                      <span className="grid h-16 min-w-32 place-items-center sm:min-w-44">
                        <img
                          src={logoUrl}
                          alt={brand.name}
                          className="max-h-14 max-w-32 object-contain transition duration-300 group-hover:scale-110 sm:max-w-44"
                        />
                      </span>
                    ) : (
                      <BrandWordmark
                        name={brand.name}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryQuickNav({
  categories,
  activeCategoryId,
}: {
  categories: CatalogFilterOptions["categories"];
  activeCategoryId?: string;
}) {
  const visibleCategories =
    categories;

  return (
    <section
      aria-label="Categorias principales"
      className="space-y-3"
    >
      <HorizontalDragScroll
        ariaLabel="Desplazar categorias"
        className="scrollbar-hidden flex cursor-grab snap-x items-center gap-3 overflow-x-auto pb-1 active:cursor-grabbing"
      >
        <Link
          href="/catalogo#buscar"
          className="flex size-14 shrink-0 snap-start items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-100 transition hover:text-pink-700"
          aria-label="Buscar productos"
        >
          <Search
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        <Link
          href="/catalogo"
          className={`flex min-h-14 shrink-0 snap-start items-center rounded-2xl px-6 text-sm font-black uppercase tracking-wide shadow-sm transition ${
            activeCategoryId
              ? "bg-white text-zinc-950 ring-1 ring-zinc-100 hover:text-pink-700"
              : "bg-zinc-950 text-white"
          }`}
        >
          Inicio
        </Link>

        <Link
          href="/catalogo#combos"
          className="flex min-h-14 shrink-0 snap-start items-center rounded-2xl bg-white px-6 text-sm font-bold uppercase tracking-wide text-zinc-950 shadow-sm ring-1 ring-zinc-100 transition hover:text-pink-700"
        >
          Combos y promociones
        </Link>

        <Link
          href="/catalogo?onOffer=true"
          className="flex min-h-14 shrink-0 snap-start items-center rounded-2xl bg-white px-6 text-sm font-bold uppercase tracking-wide text-zinc-950 shadow-sm ring-1 ring-zinc-100 transition hover:text-pink-700"
        >
          Ofertas
        </Link>

        {visibleCategories.map(
          (category) => (
            <Link
              key={category.id}
              href={`/catalogo?categoryId=${category.id}`}
              className={`flex min-h-14 shrink-0 snap-start items-center rounded-2xl px-6 text-sm font-bold uppercase tracking-wide shadow-sm transition ${
                activeCategoryId ===
                category.id
                  ? "bg-pink-600 text-white"
                  : "bg-white text-zinc-950 ring-1 ring-zinc-100 hover:text-pink-700"
              }`}
            >
              {category.name}
            </Link>
          )
        )}
      </HorizontalDragScroll>
    </section>
  );
}

function CatalogPromoBanner({
  imageUrl,
  shopName,
}: {
  imageUrl: string | null;
  shopName: string;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
      <img
        src={imageUrl}
        alt={`Banner de ${shopName}`}
        className="h-28 w-full object-cover sm:h-40 lg:h-48"
      />
    </section>
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
        <span
          data-cart-count-badge
          className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-bold"
        >
          {itemCount}
        </span>
      </summary>
      <div
        data-dropdown-panel
        className="fixed inset-x-3 top-16 z-30 max-w-none overscroll-contain touch-pan-y sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)]"
      >
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
  const categorySections =
    filterOptions.categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        products: filteredProducts.filter(
          (product) =>
            product.categoryId ===
            category.id
        ),
      }))
      .filter(
        (section) =>
          section.products.length > 0
      )
      .slice(0, 2);

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogDropdownCoordinator />
      <CatalogCartMenuController />
      <CatalogRealtimeSync
        cartId={cart?.cart.id ?? null}
      />
      <section className="overflow-visible border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)] pt-16 sm:pt-16">
        <div className="fixed inset-x-0 top-0 z-50 border-b border-pink-100/70 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
          <Link
            href="/catalogo"
            className="min-w-0"
          >
            <AdornarteBrandMark
              label="AdornArte Shop"
              subtitle="Resalta tu belleza"
              size="sm"
              variant="shop"
            />
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

        <div className="mx-auto grid max-w-6xl gap-4 px-3 py-5 sm:px-4 sm:py-10 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="mb-5 hidden sm:block">
                <AdornarteBrandMark
                  label="AdornArte Shop"
                  subtitle="Resalta tu belleza"
                  size="lg"
                  variant="shop"
                />
              </div>
              <p className="text-xs font-semibold uppercase text-pink-600 sm:text-sm">
                {settings.shopName}
              </p>
              <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
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

          <div className="hidden rounded-2xl border border-pink-100 bg-white p-4 text-zinc-950 shadow-xl shadow-pink-100/60 sm:block sm:rounded-3xl sm:p-5">
            {heroProduct ? (
              <>
                {(() => {
                  const heroPrice =
                    heroProduct.salePrice ?? 0;
                  const heroRegularPrice =
                    heroProduct.regularPrice;
                  const heroOnOffer =
                    heroRegularPrice !== null &&
                    heroRegularPrice > heroPrice;

                  return (
                    <>
                <p className="text-sm font-semibold uppercase text-pink-600">
                  {heroOnOffer
                    ? "Oferta disponible"
                    : "Disponible ahora"}
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {heroProduct.name}
                </h2>
                {heroProduct.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                    {heroProduct.description}
                  </p>
                )}
                <div className="mt-4 sm:mt-5">
                  {heroOnOffer &&
                    heroRegularPrice !== null && (
                    <div className="text-sm font-semibold text-zinc-400 line-through">
                      L{" "}
                      {heroRegularPrice.toFixed(2)}
                    </div>
                  )}
                  <div className="text-2xl font-bold sm:text-3xl">
                    L {heroPrice.toFixed(2)}
                  </div>
                </div>
                <Link
                  href={`/catalogo/productos/${heroProduct.slug}`}
                  className="mt-5 flex min-h-11 items-center justify-center rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Comprar producto
                </Link>
                    </>
                  );
                })()}
              </>
            ) : (
              <div className="py-10 text-center text-sm text-zinc-500">
                Sin productos publicados.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
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

        <CatalogPromoBanner
          imageUrl={settings.shopBannerUrl}
          shopName={settings.shopName}
        />

        <div id="buscar">
          <CategoryQuickNav
            categories={
              filterOptions.categories
            }
            activeCategoryId={
              filters.categoryId
            }
          />
        </div>

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
            <div id="combos">
              <CatalogComboRail
                combos={home.combos}
              />
            </div>
            <CatalogProductRail
              title="Comprar ahora"
              products={filteredProducts}
            />
          </>
        )}

        {!activeFilters && (
          <>
          <div id="categorias">
            <div className="space-y-8 sm:space-y-10">
              {categorySections.map(
                (section) => (
                <CatalogProductRail
                  key={section.id}
                  title={section.name}
                  products={section.products}
                  initialCount={8}
                />
                )
              )}
            </div>
          </div>

          {showFeatured && (
            <CatalogProductRail
              title="Destacados"
              products={home.featuredProducts}
            />
          )}

          {showOffers && (
            <CatalogProductRail
              title="Ofertas"
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
          </>
        )}

        <BrandMarquee
          brands={home.brands}
        />
        </div>

      </div>
    </main>
  );
}
