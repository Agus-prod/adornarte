"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { SupplierForm } from "./supplier-form";

import { SupplierFormValues } from "@/lib/purchases/supplier-schema";
import { createSupplierAction } from "@/app/(dashboard)/compras/proveedores/actions";

export function SupplierCreateContainer() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    values: SupplierFormValues
  ) {
    startTransition(async () => {
      const result =
        await createSupplierAction(values);

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
      loading={isPending}
      onSubmit={handleSubmit}
    />
  );
}