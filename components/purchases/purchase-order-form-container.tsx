"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { PurchaseOrderForm } from "./purchase-order-form";

import type { ActiveSupplier } from "@/lib/purchases/get-active-suppliers";

import type {
  PurchaseOrderFormValues,
} from "@/lib/purchases/purchase-order-schema";

type ActionResult = {
  success: boolean;
  message: string;
  id?: string;
};

type Props = {
  suppliers: ActiveSupplier[];

  action: (
    values: PurchaseOrderFormValues
  ) => Promise<ActionResult>;
};

export function PurchaseOrderFormContainer({
  suppliers,
  action,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    values: PurchaseOrderFormValues
  ) {
    startTransition(async () => {
      const result =
        await action(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      if (result.id) {
        router.push(
          `/compras/ordenes/${result.id}`
        );
      } else {
        router.push("/compras/ordenes");
      }

      router.refresh();
    });
  }

  return (
    <PurchaseOrderForm
      suppliers={suppliers}
      loading={isPending}
      onSubmit={handleSubmit}
    />
  );
}