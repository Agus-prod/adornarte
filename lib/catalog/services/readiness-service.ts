import { getCatalogProductSummaries } from "@/lib/catalog/services/catalog-service";
import { getMarketplaceFeeds } from "@/lib/catalog/services/marketplace-service";
import { getActivePromotions } from "@/lib/catalog/repositories/promotion-repository";
import { getActiveShippingZones } from "@/lib/catalog/repositories/shipping-repository";
import type { CatalogReadinessItem } from "@/lib/catalog/types";

function item(
  label: string,
  ready: boolean
): CatalogReadinessItem {
  return {
    label,
    ready,
  };
}

export async function getCommerceReadiness(
  organizationId: string
) {
  const [
    products,
    feeds,
    promotions,
    shippingZones,
  ] = await Promise.all([
    getCatalogProductSummaries(
      organizationId
    ),
    getMarketplaceFeeds(
      organizationId
    ),
    getActivePromotions(
      organizationId
    ),
    getActiveShippingZones(
      organizationId
    ),
  ]);

  return [
    item("Catalogo", products.length > 0),
    item("Producto", products.length > 0),
    item("Variantes", true),
    item("Imagenes", true),
    item("SEO", true),
    item("Home", true),
    item("Carrito", true),
    item("Checkout", true),
    item("Pedidos", true),
    item("Clientes", true),
    item("Pagos", true),
    item(
      "Promociones",
      promotions.length > 0
    ),
    item(
      "Envios",
      shippingZones.length > 0
    ),
    item(
      "Marketplace",
      feeds.length > 0
    ),
  ];
}
