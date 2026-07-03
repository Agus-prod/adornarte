import { getActiveShippingZones } from "@/lib/catalog/repositories/shipping-repository";

export async function getShippingQuote(
  organizationId: string,
  city: string,
  subtotal: number,
  weightKg = 0
) {
  const zones =
    await getActiveShippingZones(
      organizationId
    );
  const zone =
    zones.find(
      (item) =>
        item.city?.toLowerCase() ===
        city.toLowerCase()
    ) ?? zones[0];

  if (!zone) {
    return null;
  }

  if (
    zone.free_shipping_minimum !== null &&
    subtotal >=
      zone.free_shipping_minimum
  ) {
    return {
      zone,
      cost: 0,
    };
  }

  return {
    zone,
    cost:
      Number(zone.base_rate) +
      Number(zone.rate_per_kg) *
        weightKg,
  };
}
