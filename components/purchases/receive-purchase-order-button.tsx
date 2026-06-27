"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { receivePurchaseOrderAction } from "@/app/(dashboard)/compras/ordenes/actions";

type Props = {
  purchaseOrderId: string;
};

export function ReceivePurchaseOrderButton({
  purchaseOrderId,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleReceive() {
    if (
      !window.confirm(
        "¿Desea recibir esta orden de compra?"
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result =
        await receivePurchaseOrderAction(
          purchaseOrderId
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.refresh();
    });
  }

  return (
    <Button
      onClick={handleReceive}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700"
    >
      {isPending
        ? "Recibiendo..."
        : "Recibir orden"}
    </Button>
  );
}