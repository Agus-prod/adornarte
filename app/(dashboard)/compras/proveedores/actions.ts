"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  supplierSchema,
  SupplierFormValues,
} from "@/lib/purchases/supplier-schema";

export async function createSupplierAction(
  values: SupplierFormValues
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "Usuario no autenticado.",
    };
  }

  const parsed = supplierSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
      errors: parsed.error.flatten(),
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .insert({
      organization_id: profile.organization_id,

      name: parsed.data.name,
      contact_name: parsed.data.contact_name || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      rtn: parsed.data.rtn || null,
      notes: parsed.data.notes || null,
      is_active: parsed.data.is_active,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/compras/proveedores");

  return {
    success: true,
    message: "Proveedor creado correctamente.",
  };
}

export async function updateSupplierAction(
  id: string,
  values: SupplierFormValues
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "Usuario no autenticado.",
    };
  }

  const parsed = supplierSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
      errors: parsed.error.flatten(),
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .update({
      name: parsed.data.name,
      contact_name: parsed.data.contact_name || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      rtn: parsed.data.rtn || null,
      notes: parsed.data.notes || null,
      is_active: parsed.data.is_active,
    })
    .eq("id", id)
    .eq(
      "organization_id",
      profile.organization_id
    );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/compras/proveedores");

  return {
    success: true,
    message: "Proveedor actualizado correctamente.",
  };
}
export async function toggleSupplierStatusAction(
  id: string
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "Usuario no autenticado.",
    };
  }

  const supabase = await createClient();

  const { data: supplier, error } = await supabase
    .from("suppliers")
    .select("is_active")
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .single();

  if (error || !supplier) {
    return {
      success: false,
      message: "Proveedor no encontrado.",
    };
  }

  const { error: updateError } = await supabase
    .from("suppliers")
    .update({
      is_active: !supplier.is_active,
    })
    .eq("id", id)
    .eq("organization_id", profile.organization_id);

  if (updateError) {
    return {
      success: false,
      message: updateError.message,
    };
  }

  revalidatePath("/compras/proveedores");

  return {
    success: true,
    message: supplier.is_active
      ? "Proveedor desactivado."
      : "Proveedor activado.",
  };
}