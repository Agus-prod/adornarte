import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  createCustomer,
  createCustomerAddress,
  getCustomerAddresses,
  getCustomerByAuthUserId,
  getCustomerByEmail,
  updateCustomer,
} from "@/lib/catalog/repositories/customer-repository";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { syncCatalogCustomerToErp } from "@/lib/customers/sync-catalog-customer";
import type { CatalogCustomerAccount } from "@/lib/catalog/types";
import { createAdminClient } from "@/lib/supabase/admin";

const customerEmailCookie =
  "adornarte_catalog_customer_email";
const minimumPasswordLength = 8;

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

function readFirstText(
  formData: FormData,
  keys: string[]
) {
  for (const key of keys) {
    const value = readText(
      formData,
      key
    );

    if (value) {
      return value;
    }
  }

  return "";
}

function readFirstOptionalText(
  formData: FormData,
  keys: string[]
) {
  const value = readFirstText(
    formData,
    keys
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

async function clearCustomerEmail() {
  const cookieStore = await cookies();

  cookieStore.delete(
    customerEmailCookie
  );
}

function normalizeEmail(email: string) {
  return email.toLowerCase();
}

function getPassword(formData: FormData) {
  return readText(
    formData,
    "password"
  );
}

function assertPassword(password: string) {
  if (
    password.length <
    minimumPasswordLength
  ) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres."
    );
  }
}

function isMissingColumnError(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  const code = error.code;
  const message =
    "message" in error
      ? String(error.message)
      : "";

  return (
    code === "42703" ||
    (code === "PGRST204" &&
      message.includes("auth_user_id"))
  );
}

async function getCurrentAuthUser() {
  const supabase =
    await createClient();
  const { data, error } =
    await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

async function linkAuthUserToCustomer(
  customerId: string,
  organizationId: string,
  authUserId: string
) {
  try {
    return await updateCustomer(
      customerId,
      organizationId,
      {
        auth_user_id: authUserId,
        updated_at:
          new Date().toISOString(),
      }
    );
  } catch (error) {
    if (isMissingColumnError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getCurrentCustomerEmail() {
  const user =
    await getCurrentAuthUser();

  if (user?.email) {
    return normalizeEmail(user.email);
  }

  const cookieStore = await cookies();
  return (
    cookieStore.get(customerEmailCookie)
      ?.value ?? null
  );
}

export async function getCurrentCatalogCustomer() {
  const organizationId =
    getOrganizationId();
  const user =
    await getCurrentAuthUser();

  if (!user) {
    return null;
  }

  const customerByAuth =
    await getCustomerByAuthUserId(
      organizationId,
      user.id
    );

  if (customerByAuth) {
    return customerByAuth;
  }

  if (!user.email) {
    return null;
  }

  const customerByEmail =
    await getCustomerByEmail(
      organizationId,
      normalizeEmail(user.email)
    );

  if (!customerByEmail) {
    return null;
  }

  const linkedCustomer =
    await linkAuthUserToCustomer(
      customerByEmail.id,
      organizationId,
      user.id
    );

  return linkedCustomer ?? customerByEmail;
}

export async function loginCustomerFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const email = readText(
    formData,
    "email"
  ).toLowerCase();
  const password = getPassword(formData);

  if (!email || !password) {
    throw new Error(
      "Email y contraseña requeridos."
    );
  }

  const supabase =
    await createClient();
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    throw new Error(
      "No encontramos una cuenta con esas credenciales."
    );
  }

  const customer =
    (await getCustomerByAuthUserId(
      organizationId,
      data.user.id
    )) ??
    await getCustomerByEmail(
      organizationId,
      email
    );

  if (!customer) {
    throw new Error(
        "No encontramos una cuenta con ese email."
    );
  }

  if (
    customer.auth_user_id !==
    data.user.id
  ) {
    await linkAuthUserToCustomer(
      customer.id,
      organizationId,
      data.user.id
    );
  }

  await clearCustomerEmail();
}

export async function logoutCustomer() {
  const supabase =
    await createClient();
  await supabase.auth.signOut();
  await clearCustomerEmail();
}

export async function createCustomerAccount(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const email = normalizeEmail(
    readText(formData, "email")
  );
  const name = readText(
    formData,
    "name"
  );
  const phone = readOptionalText(
    formData,
    "phone"
  );
  const password = getPassword(formData);

  if (!email || !name || !password) {
    throw new Error(
      "Nombre, email y contraseña requeridos."
    );
  }

  assertPassword(password);

  const existingCustomer =
    await getCustomerByEmail(
      organizationId,
      email
    );

  if (existingCustomer?.auth_user_id) {
    throw new Error(
      "Ya existe una cuenta con ese email."
    );
  }

  const admin = createAdminClient();
  const { data, error } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        organization_id: organizationId,
        source: "online_store",
      },
    });

  let authUserId = data.user?.id ?? null;

  if (error || !authUserId) {
    const supabase =
      await createClient();
    const signInResult =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (
      signInResult.error ||
      !signInResult.data.user
    ) {
      throw new Error(
        "Ya existe una cuenta con ese email o no se pudo crear la cuenta."
      );
    }

    authUserId =
      signInResult.data.user.id;
  }

  let catalogCustomer =
    existingCustomer;

  if (catalogCustomer) {
    try {
      catalogCustomer =
        await updateCustomer(
          catalogCustomer.id,
          organizationId,
          {
            auth_user_id: authUserId,
            name,
            phone,
            updated_at:
              new Date().toISOString(),
          }
        );
    } catch (error) {
      if (!isMissingColumnError(error)) {
        throw error;
      }

      catalogCustomer =
        await updateCustomer(
          catalogCustomer.id,
          organizationId,
          {
            name,
            phone,
            updated_at:
              new Date().toISOString(),
          }
        );
    }
  } else {
    try {
      catalogCustomer =
        await createCustomer({
          organization_id: organizationId,
          auth_user_id: authUserId,
          email,
          name,
          phone,
        });
    } catch (error) {
      if (!isMissingColumnError(error)) {
        throw error;
      }

      catalogCustomer =
        await createCustomer({
          organization_id: organizationId,
          email,
          name,
          phone,
        });
    }
  }

  if (
    catalogCustomer.auth_user_id !==
    authUserId
  ) {
    await linkAuthUserToCustomer(
        catalogCustomer.id,
        organizationId,
        authUserId
      );
  }

  await syncCatalogCustomerToErp({
    organizationId,
    name: catalogCustomer.name,
    email: catalogCustomer.email,
    phone: catalogCustomer.phone,
  });

  const supabase =
    await createClient();
  const signInResult =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInResult.error) {
    throw signInResult.error;
  }

  await clearCustomerEmail();
}

export async function saveCustomerProfile(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const email = readFirstText(
    formData,
    [
      "email",
      "customer_email",
    ]
  ).toLowerCase();
  const name = readFirstText(
    formData,
    [
      "name",
      "customer_name",
    ]
  );
  const phone = readFirstOptionalText(
    formData,
    [
      "phone",
      "customer_phone",
    ]
  );

  if (!email || !name) {
    throw new Error(
      "Nombre y email requeridos."
    );
  }

  const user =
    await getCurrentAuthUser();
  const customer =
    user
      ? await getCurrentCatalogCustomer()
      : await getCustomerByEmail(
          organizationId,
          email
        );

  if (customer) {
    try {
      await updateCustomer(
        customer.id,
        organizationId,
        {
          auth_user_id:
            user?.id ??
            customer.auth_user_id,
          name,
          phone,
          updated_at:
            new Date().toISOString(),
        }
      );
    } catch (error) {
      if (!isMissingColumnError(error)) {
        throw error;
      }

      await updateCustomer(
        customer.id,
        organizationId,
        {
          name,
          phone,
          updated_at:
            new Date().toISOString(),
        }
      );
    }
  } else {
    await createCustomer({
      organization_id: organizationId,
      email,
      name,
      phone,
    });
  }

  await syncCatalogCustomerToErp({
    organizationId,
    name,
    email,
    phone,
  });

  if (!user) {
    await setCustomerEmail(email);
  }
}

export async function createCustomerAddressFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const customer =
    await getCurrentCatalogCustomer();

  if (!customer) {
    throw new Error(
      "Cliente requerido."
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
  const customer =
    await getCurrentCatalogCustomer();

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
