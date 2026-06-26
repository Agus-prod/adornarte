
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { SupplierForm } from "./supplier-form";

import { SupplierFormValues } from "@/lib/purchases/supplier-schema";
import { updateSupplierAction } from "@/app/(dashboard)/compras/proveedores/actions";

type Props = {
  supplierId: string;
  defaultValues: SupplierFormValues;
};

export function SupplierEditContainer({
  supplierId,
  defaultValues,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    values: SupplierFormValues
  ) {
    startTransition(async () => {
      const result =
        await updateSupplierAction(
          supplierId,
          values
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push("/compras/proveedores");

      router.refresh();
    });
  }

  return (
    <SupplierForm
      defaultValues={defaultValues}
      submitLabel="Guardar cambios"
      loading={isPending}
      onSubmit={handleSubmit}
    />
  );
}