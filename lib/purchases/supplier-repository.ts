import { createClient } from "@/lib/supabase/server";
import { SupplierFormValues } from "./supplier-schema";

export async function createSupplier(
  organizationId: string,
  values: SupplierFormValues
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .insert({
      organization_id: organizationId,
      ...values,
    });

  if (error) {
    throw new Error(error.message);
  }
}