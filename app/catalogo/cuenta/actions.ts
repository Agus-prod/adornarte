"use server";

import { revalidatePath } from "next/cache";
import {
  createCustomerAccount,
  createCustomerAddressFromForm,
  loginCustomerFromForm,
  logoutCustomer,
  saveCustomerProfile,
} from "@/lib/catalog/services/customer-service";

export type CatalogAccountActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

const initialAccountActionState: CatalogAccountActionState =
  {
    status: "idle",
    message: null,
  };

export async function saveCatalogCustomerProfile(
  formData: FormData
) {
  await saveCustomerProfile(formData);

  revalidatePath("/catalogo/cuenta");
  revalidatePath("/catalogo");
  revalidatePath("/clientes");
}

export async function createCatalogCustomerAccountInline(
  _state: CatalogAccountActionState,
  formData: FormData
): Promise<CatalogAccountActionState> {
  try {
    await createCustomerAccount(formData);

    revalidatePath("/catalogo/cuenta");
    revalidatePath("/catalogo");
    revalidatePath("/clientes");

    return {
      status: "success",
      message: "Cuenta creada correctamente.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        getCreateAccountErrorMessage(error),
    };
  }
}

export async function createCatalogCustomerAccount(
  formData: FormData
): Promise<CatalogAccountActionState> {
  try {
    await createCustomerAccount(formData);

    revalidatePath("/catalogo/cuenta");
    revalidatePath("/catalogo");
    revalidatePath("/clientes");

    return {
      status: "success",
      message: "Cuenta creada correctamente.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        getCreateAccountErrorMessage(error),
    };
  }
}

function getCreateAccountErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    if (error.message.includes("Ya existe")) {
      return "Ya existe una cuenta con ese email. Intenta iniciar sesion.";
    }

    if (
      error.message.includes("contraseña") ||
      error.message.includes("contrasena")
    ) {
      return "La contrasena debe tener al menos 8 caracteres.";
    }

    if (
      error.message.includes("requeridos") ||
      error.message.includes("requerido")
    ) {
      return error.message;
    }
  }

  return "No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.";
}

export async function loginCatalogCustomerInline(
  _state: CatalogAccountActionState,
  formData: FormData
): Promise<CatalogAccountActionState> {
  try {
    await loginCustomerFromForm(formData);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message ===
        "No encontramos una cuenta con ese email." ||
        error.message ===
          "No encontramos una cuenta con esas credenciales.")
    ) {
      return {
        status: "error",
        message:
          "No encontramos esa cuenta. Puedes crearla abajo.",
      };
    }

    return {
      status: "error",
      message:
        "No se pudo iniciar sesion. Revisa los datos e intenta de nuevo.",
    };
  }

  revalidatePath("/catalogo/cuenta");
  revalidatePath("/catalogo");
  revalidatePath("/clientes");

  return {
    status: "success",
    message: "Sesion iniciada correctamente.",
  };
}

export async function loginCatalogCustomer(
  formData: FormData
): Promise<CatalogAccountActionState> {
  try {
    await loginCustomerFromForm(formData);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message ===
        "No encontramos una cuenta con ese email." ||
        error.message ===
          "No encontramos una cuenta con esas credenciales.")
    ) {
      return {
        status: "error",
        message:
          "No encontramos esa cuenta. Puedes crearla abajo.",
      };
    }

    return {
      status: "error",
      message:
        "No se pudo iniciar sesion. Revisa los datos e intenta de nuevo.",
    };
  }

  revalidatePath("/catalogo/cuenta");
  revalidatePath("/catalogo");
  revalidatePath("/clientes");

  return {
    status: "success",
    message: "Sesion iniciada correctamente.",
  };
}

export async function logoutCatalogCustomer() {
  await logoutCustomer();

  revalidatePath("/catalogo/cuenta");
  revalidatePath("/catalogo");
}

export async function createCatalogCustomerAddress(
  formData: FormData
) {
  await createCustomerAddressFromForm(
    formData
  );

  revalidatePath("/catalogo/cuenta");
}

export async function getInitialCatalogAccountActionState() {
  return initialAccountActionState;
}
