import {
  createLoyaltyAccount,
  createLoyaltyMovement,
  getLoyaltyAccount,
  updateLoyaltyAccount,
} from "@/lib/catalog/repositories/loyalty-repository";

export async function getOrCreateLoyaltyAccount(
  organizationId: string,
  customerEmail: string
) {
  const existing =
    await getLoyaltyAccount(
      organizationId,
      customerEmail
    );

  if (existing) {
    return existing;
  }

  return createLoyaltyAccount({
    organization_id: organizationId,
    customer_email: customerEmail,
  });
}

export async function addLoyaltyPoints(
  organizationId: string,
  customerEmail: string,
  points: number,
  referenceType?: string | null,
  referenceId?: string | null
) {
  const account =
    await getOrCreateLoyaltyAccount(
      organizationId,
      customerEmail
    );
  const balance =
    account.points_balance + points;

  await updateLoyaltyAccount(
    account.id,
    organizationId,
    {
      points_balance: balance,
      tier:
        balance >= 1000
          ? "vip"
          : account.tier,
      updated_at: new Date().toISOString(),
    }
  );

  return createLoyaltyMovement({
    organization_id: organizationId,
    loyalty_account_id: account.id,
    type: points >= 0 ? "earn" : "redeem",
    points,
    reference_type:
      referenceType ?? null,
    reference_id: referenceId ?? null,
  });
}
