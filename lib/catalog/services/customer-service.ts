import { cookies } from "next/headers";
import {
  createCustomer,
  createCustomerAddress,
  getCustomerAddresses,
  getCustomerByEmail,
  updateCustomer,
} from "@/lib/catalog/repositories/customer-repository";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import type { CatalogCustomerAccount } from "@/lib/catalog/types";
import { createAdminClient } from "@/lib/supabase/admin";

const customerEmailCookie =
  "adornarte_catalog_customer_email";

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

function getOrganizationId() {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    throw new Error(
      "Catalogo no configurado."
    );
  }

  return organizationId;
}

async function setCustomerEmail(
  email: string
) {
  const cookieStore = await cookies();

  cookieStore.set(
    customerEmailCookie,
    email.toLowerCase(),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    }
  );
}

export async function getCurrentCustomerEmail() {
  const cookieStore = await cookies();

  return (
    cookieStore.get(customerEmailCookie)
      ?.value ?? null
  );
}

export async function saveCustomerProfile(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const email = readText(
    formData,
    "email"
  ).toLowerCase();
  const name = readText(
    formData,
    "name"
  );
  const phone = readOptionalText(
    formData,
    "phone"
  );

  if (!email || !name) {
    throw new Error(
      "Nombre y email requeridos."
    );
  }

  const customer =
    await getCustomerByEmail(
      organizationId,
      email
    );

  if (customer) {
    await updateCustomer(
      customer.id,
      organizationId,
      {
        name,
        phone,
        updated_at: new Date().toISOString(),
      }
    );
  } else {
    await createCustomer({
      organization_id: organizationId,
      email,
      name,
      phone,
    });
  }

  await setCustomerEmail(email);
}

export async function createCustomerAddressFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const email =
    await getCurrentCustomerEmail();

  if (!email) {
    throw new Error(
      "Cliente requerido."
    );
  }

  const customer =
    await getCustomerByEmail(
      organizationId,
      email
    );

  if (!customer) {
    throw new Error(
      "Cliente no encontrado."
    );
  }

  await createCustomerAddress({
    organization_id: organizationId,
    customer_id: customer.id,
    label:
      readText(formData, "label") ||
      "Principal",
    recipient_name: readText(
      formData,
      "recipient_name"
    ),
    phone: readOptionalText(
      formData,
      "phone"
    ),
    address: readText(
      formData,
      "address"
    ),
    city: readText(formData, "city"),
    notes: readOptionalText(
      formData,
      "notes"
    ),
    is_default:
      formData.get("is_default") === "on",
  });
}

export async function getCustomerAccount(): Promise<CatalogCustomerAccount | null> {
  const organizationId =
    getOrganizationId();
  const email =
    await getCurrentCustomerEmail();

  if (!email) {
    return null;
  }

  const customer =
    await getCustomerByEmail(
      organizationId,
      email
    );

  if (!customer) {
    return null;
  }

  const supabase = createAdminClient();
  const [
    addresses,
    ordersResult,
  ] = await Promise.all([
    getCustomerAddresses(
      customer.id,
      organizationId
    ),
    supabase
      .from("catalog_orders")
      .select("*")
      .eq(
        "organization_id",
        organizationId
      )
      .eq(
        "customer_email",
        customer.email
      )
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  return {
    customer,
    addresses,
    orders: ordersResult.data,
  };
}
