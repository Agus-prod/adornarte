"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { userRoles } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateUserState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function readText(
  formData: FormData,
  key: string
) {
  return (
    formData.get(key)?.toString().trim() ??
    ""
  );
}

function normalizeEmail(email: string) {
  return email.toLowerCase();
}

function isAllowedRole(
  role: string
): role is (typeof userRoles)[number] {
  return userRoles.includes(
    role as (typeof userRoles)[number]
  );
}

function getCreateUserErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    const message =
      error.message.toLowerCase();

    if (
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists") ||
      message.includes("duplicate")
    ) {
      return "Ya existe un usuario con ese correo.";
    }

    if (
      message.includes("password") ||
      message.includes("contrasena")
    ) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return error.message;
  }

  return "No se pudo crear el usuario.";
}

export async function createStaffUser(
  _state: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const currentProfile =
    await getCurrentProfile();

  if (!currentProfile) {
    return {
      status: "error",
      message: "Usuario no autenticado.",
    };
  }

  if (currentProfile.role !== "admin") {
    return {
      status: "error",
      message:
        "Solo un administrador puede crear usuarios.",
    };
  }

  const fullName = readText(
    formData,
    "full_name"
  );
  const email = normalizeEmail(
    readText(formData, "email")
  );
  const password = readText(
    formData,
    "password"
  );
  const role = readText(
    formData,
    "role"
  );

  if (
    !fullName ||
    !email ||
    !password ||
    !role
  ) {
    return {
      status: "error",
      message:
        "Nombre, correo, contraseña y rol son requeridos.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message:
        "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  if (!isAllowedRole(role)) {
    return {
      status: "error",
      message: "Selecciona un rol valido.",
    };
  }

  const admin = createAdminClient();

  const { data, error } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        organization_id:
          currentProfile.organization_id,
        role,
      },
    });

  if (error || !data.user) {
    return {
      status: "error",
      message: getCreateUserErrorMessage(
        error
      ),
    };
  }

  const { error: profileError } =
    await admin.from("profiles").upsert(
      {
        id: data.user.id,
        organization_id:
          currentProfile.organization_id,
        branch_id: null,
        email,
        full_name: fullName,
        role,
        is_active: true,
      },
      {
        onConflict: "id",
      }
    );

  if (profileError) {
    return {
      status: "error",
      message:
        "El usuario fue creado, pero no se pudo guardar su perfil.",
    };
  }

  revalidatePath(
    "/configuracion/perfiles"
  );

  return {
    status: "success",
    message: `Usuario ${email} creado con rol ${role}.`,
  };
}
