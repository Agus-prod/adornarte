import type { Metadata } from "next";
import { CommerceHome } from "@/components/catalog/commerce-home";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import {
  getCatalogFilterOptions,
  getFilteredCatalogProducts,
} from "@/lib/catalog/services/filter-service";
import { getCatalogHomeData } from "@/lib/catalog/services/home-service";
import { getCatalogSettingsView } from "@/lib/catalog/services/settings-service";
import {
  getCatalogAutocompleteSuggestions,
  searchCatalogProducts,
} from "@/lib/catalog/services/search-service";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCatalogCustomer } from "@/lib/catalog/services/customer-service";
import { buildCatalogMetadata } from "@/lib/catalog/services/seo-service";
import type { CatalogProductFilters } from "@/lib/catalog/types";

type SearchParams = Record<
  string,
  string | string[] | undefined
>;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata =
  buildCatalogMetadata({
    title: "Catalogo",
    description:
      "Compra maquillaje desde AdornArte.",
  });

function getParam(
  searchParams: SearchParams,
  key: string
) {
  const value = searchParams[key];

  return Array.isArray(value)
    ? value[0]
    : value;
}

function getNumberParam(
  searchParams: SearchParams,
  key: string
) {
  const value = Number(
    getParam(searchParams, key)
  );

  return Number.isFinite(value)
    ? value
    : undefined;
}

function getFilters(
  searchParams: SearchParams
): CatalogProductFilters {
  return {
    brandId: getParam(
      searchParams,
      "brandId"
    ),
    categoryId: getParam(
      searchParams,
      "categoryId"
    ),
    minPrice: getNumberParam(
      searchParams,
      "minPrice"
    ),
    maxPrice: getNumberParam(
      searchParams,
      "maxPrice"
    ),
    color: getParam(
      searchParams,
      "color"
    ),
    tone: getParam(
      searchParams,
      "tone"
    ),
    finish: getParam(
      searchParams,
      "finish"
    ),
    inStock:
      getParam(
        searchParams,
        "inStock"
      ) === "on",
    onOffer:
      getParam(
        searchParams,
        "onOffer"
      ) === "on",
  };
}

function cleanFilters(
  filters: CatalogProductFilters
): CatalogProductFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== false &&
        value !== ""
    )
  );
}

export default async function CatalogPage({
  searchParams,
}: PageProps) {
  const organizationId =
    getPublicCatalogOrganizationId();
  const resolvedSearchParams =
    await searchParams;
  const query =
    getParam(
      resolvedSearchParams,
      "q"
    ) ?? "";
  const orderReceived =
    getParam(
      resolvedSearchParams,
      "pedido"
    ) === "recibido";
  const filters = cleanFilters(
    getFilters(resolvedSearchParams)
  );

  if (!organizationId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          Catalogo no configurado
        </h1>
      </main>
    );
  }

  const [
    home,
    filterOptions,
    filteredProducts,
    searchResults,
    suggestions,
    settings,
    cart,
    customer,
  ] = await Promise.all([
    getCatalogHomeData(organizationId),
    getCatalogFilterOptions(
      organizationId
    ),
    getFilteredCatalogProducts(
      organizationId,
      filters
    ),
    query
      ? searchCatalogProducts(
          organizationId,
          query
        )
      : Promise.resolve([]),
    query
      ? getCatalogAutocompleteSuggestions(
          organizationId,
          query
        )
      : Promise.resolve([]),
    getCatalogSettingsView(
      organizationId
    ),
    getCartDetail(),
    getCurrentCatalogCustomer(),
  ]);

  return (
    <CommerceHome
      home={home}
      filterOptions={filterOptions}
      filters={filters}
      filteredProducts={
        query
          ? searchResults
          : filteredProducts
      }
      suggestions={suggestions}
      query={query}
      orderReceived={orderReceived}
      settings={settings}
      cart={cart}
      customer={customer}
    />
  );
}
