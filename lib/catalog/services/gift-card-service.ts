import {
  createGiftCard,
  getGiftCardByCode,
  updateGiftCard,
} from "@/lib/catalog/repositories/gift-card-repository";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function createCode() {
  return `GC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function issueGiftCard(
  organizationId: string,
  amount: number,
  recipientEmail?: string | null,
  purchaserEmail?: string | null
) {
  if (amount <= 0) {
    throw new Error(
      "Monto no valido."
    );
  }

  return createGiftCard({
    organization_id: organizationId,
    code: createCode(),
    initial_balance: amount,
    current_balance: amount,
    recipient_email:
      recipientEmail ?? null,
    purchaser_email:
      purchaserEmail ?? null,
  });
}

export async function redeemGiftCard(
  organizationId: string,
  code: string,
  amount: number
) {
  const giftCard =
    await getGiftCardByCode(
      organizationId,
      normalizeCode(code)
    );

  if (
    !giftCard ||
    giftCard.status !== "active"
  ) {
    throw new Error(
      "Gift card no valida."
    );
  }

  if (
    giftCard.expires_at &&
    new Date(giftCard.expires_at).getTime() <
      Date.now()
  ) {
    await updateGiftCard(
      giftCard.id,
      organizationId,
      {
        status: "expired",
      }
    );
    throw new Error(
      "Gift card expirada."
    );
  }

  const redemption = Math.min(
    amount,
    Number(giftCard.current_balance)
  );
  const nextBalance =
    Number(giftCard.current_balance) -
    redemption;

  return updateGiftCard(
    giftCard.id,
    organizationId,
    {
      current_balance: nextBalance,
      status:
        nextBalance <= 0
          ? "redeemed"
          : "active",
      updated_at: new Date().toISOString(),
    }
  );
}
