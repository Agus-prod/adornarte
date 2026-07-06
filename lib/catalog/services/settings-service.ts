import type { Json } from "@/lib/database.types";
import {
  getCatalogSettings,
  upsertCatalogSettings,
} from "@/lib/catalog/repositories/settings-repository";
import type {
  CatalogBankAccount,
  CatalogSettingsView,
} from "@/lib/catalog/types";

const defaultShopName =
  "AdornArte Shop";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function readOptionalText(
  formData: FormData,
  key: string
) {
  const value = readText(
    formData,
    key
  );

  return value || null;
}

function readBankAccounts(
  formData: FormData
): CatalogBankAccount[] {
  const accounts: CatalogBankAccount[] = [];

  for (let index = 0; index < 5; index += 1) {
    const bankName = readText(
      formData,
      `bank_${index}_name`
    );
    const accountName = readText(
      formData,
      `bank_${index}_account_name`
    );
    const accountNumber = readText(
      formData,
      `bank_${index}_account_number`
    );
    const accountType =
      readOptionalText(
        formData,
        `bank_${index}_account_type`
      );
    const currency =
      readText(
        formData,
        `bank_${index}_currency`
      ) || "HNL";

    if (
      !bankName &&
      !accountName &&
      !accountNumber
    ) {
      continue;
    }

    if (
      !bankName ||
      !accountName ||
      !accountNumber
    ) {
      throw new Error(
        "Cada cuenta bancaria debe tener banco, titular y numero."
      );
    }

    accounts.push({
      id: `bank-${index}`,
      bankName,
      accountName,
      accountNumber,
      accountType,
      currency,
    });
  }

  return accounts;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readRecordString(
  value: Record<string, unknown>,
  key: string
) {
  const field = value[key];

  return typeof field === "string"
    ? field
    : "";
}

function parseBankAccounts(
  value: Json
): CatalogBankAccount[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const bankName =
        readRecordString(
          item,
          "bankName"
        );
      const accountName =
        readRecordString(
          item,
          "accountName"
        );
      const accountNumber =
        readRecordString(
          item,
          "accountNumber"
        );

      if (
        !bankName ||
        !accountName ||
        !accountNumber
      ) {
        return null;
      }

      return {
        id:
          readRecordString(
            item,
            "id"
          ) || `bank-${index}`,
        bankName,
        accountName,
        accountNumber,
        accountType:
          readRecordString(
            item,
            "accountType"
          ) || null,
        currency:
          readRecordString(
            item,
            "currency"
          ) || "HNL",
      };
    })
    .filter(
      (
        account
      ): account is CatalogBankAccount =>
        account !== null
    );
}

export async function getCatalogSettingsView(
  organizationId: string
): Promise<CatalogSettingsView> {
  const settings =
    await getCatalogSettings(
      organizationId
    );

  return {
    shopName:
      settings?.shop_name ??
      defaultShopName,
    shopTagline:
      settings?.shop_tagline ??
      "Maquillaje, belleza y cuidado personal",
    shopDescription:
      settings?.shop_description ??
      "Encuentra tus productos favoritos y compra en linea de forma facil.",
    billingName:
      settings?.billing_name ?? null,
    billingRtn:
      settings?.billing_rtn ?? null,
    billingAddress:
      settings?.billing_address ?? null,
    billingEmail:
      settings?.billing_email ?? null,
    billingPhone:
      settings?.billing_phone ?? null,
    whatsappNumber:
      settings?.whatsapp_number ?? null,
    orderWhatsappRecipient:
      settings?.order_whatsapp_recipient ??
      null,
    bankAccounts: settings
      ? parseBankAccounts(
          settings.bank_accounts
        )
      : [],
    checkoutNotes:
      settings?.checkout_notes ?? null,
    privacyPolicyUrl:
      settings?.privacy_policy_url ?? null,
    termsUrl:
      settings?.terms_url ?? null,
  };
}

export async function saveCatalogSettingsFromForm(
  organizationId: string,
  formData: FormData
) {
  const shopName =
    readText(formData, "shop_name") ||
    defaultShopName;
  const bankAccounts =
    readBankAccounts(formData);

  await upsertCatalogSettings({
    organization_id: organizationId,
    shop_name: shopName,
    shop_tagline:
      readOptionalText(
        formData,
        "shop_tagline"
      ),
    shop_description:
      readOptionalText(
        formData,
        "shop_description"
      ),
    billing_name:
      readOptionalText(
        formData,
        "billing_name"
      ),
    billing_rtn:
      readOptionalText(
        formData,
        "billing_rtn"
      ),
    billing_address:
      readOptionalText(
        formData,
        "billing_address"
      ),
    billing_email:
      readOptionalText(
        formData,
        "billing_email"
      ),
    billing_phone:
      readOptionalText(
        formData,
        "billing_phone"
      ),
    whatsapp_number:
      readOptionalText(
        formData,
        "whatsapp_number"
      ),
    order_whatsapp_recipient:
      readOptionalText(
        formData,
        "order_whatsapp_recipient"
      ),
    bank_accounts:
      bankAccounts as unknown as Json,
    checkout_notes:
      readOptionalText(
        formData,
        "checkout_notes"
      ),
    privacy_policy_url:
      readOptionalText(
        formData,
        "privacy_policy_url"
      ),
    terms_url:
      readOptionalText(
        formData,
        "terms_url"
      ),
    updated_at: new Date().toISOString(),
  });
}
