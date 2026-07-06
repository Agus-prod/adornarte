import type { CatalogBankAccount } from "@/lib/catalog/types";
import { getCatalogSettingsView } from "@/lib/catalog/services/settings-service";

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(
  value: Record<string, unknown>,
  key: string
) {
  const field = value[key];

  return typeof field === "string"
    ? field.trim()
    : "";
}

function toBankAccount(
  value: unknown,
  index: number
): CatalogBankAccount | null {
  if (!isRecord(value)) {
    return null;
  }

  const bankName = readString(
    value,
    "bankName"
  );
  const accountName = readString(
    value,
    "accountName"
  );
  const accountNumber = readString(
    value,
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
      readString(value, "id") ||
      `${bankName}-${index}`,
    bankName,
    accountName,
    accountNumber,
    accountType:
      readString(value, "accountType") ||
      null,
    currency:
      readString(value, "currency") ||
      "HNL",
  };
}

export function getCatalogBankAccounts(): CatalogBankAccount[] {
  const raw =
    process.env.CATALOG_BANK_ACCOUNTS;

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(toBankAccount)
      .filter(
        (
          account
        ): account is CatalogBankAccount =>
          account !== null
      );
  } catch {
    return [];
  }
}

export async function getConfiguredCatalogBankAccounts(
  organizationId: string
) {
  const settings =
    await getCatalogSettingsView(
      organizationId
    );

  if (settings.bankAccounts.length > 0) {
    return settings.bankAccounts;
  }

  return getCatalogBankAccounts();
}
