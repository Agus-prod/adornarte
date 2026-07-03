import {
  createAnalyticsEvent,
  getAnalyticsEvents,
  toJsonMetadata,
} from "@/lib/catalog/repositories/analytics-repository";
import type { CatalogAnalyticsSummary } from "@/lib/catalog/types";

export async function trackCatalogEvent(
  organizationId: string,
  eventType: string,
  metadata: Record<string, string | number | boolean | null> = {},
  value?: number | null,
  productId?: string | null,
  cartId?: string | null,
  orderId?: string | null,
  customerEmail?: string | null
) {
  return createAnalyticsEvent({
    organization_id: organizationId,
    event_type: eventType,
    metadata: toJsonMetadata(metadata),
    value: value ?? null,
    product_id: productId ?? null,
    cart_id: cartId ?? null,
    order_id: orderId ?? null,
    customer_email:
      customerEmail ?? null,
  });
}

export async function getCatalogAnalyticsSummary(
  organizationId: string
): Promise<CatalogAnalyticsSummary> {
  const events =
    await getAnalyticsEvents(
      organizationId
    );
  const views = events.filter(
    (event) =>
      event.event_type ===
      "product_view"
  ).length;
  const cartAdds = events.filter(
    (event) =>
      event.event_type === "cart_add"
  ).length;
  const orders = events.filter(
    (event) =>
      event.event_type === "order_created"
  );
  const revenue = orders.reduce(
    (total, event) =>
      total + Number(event.value ?? 0),
    0
  );

  return {
    views,
    cartAdds,
    orders: orders.length,
    revenue,
    conversionRate:
      views > 0
        ? orders.length / views
        : 0,
  };
}
