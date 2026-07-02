"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  savePurchaseOrderAction,
  sendPurchaseOrderAction,
  deletePurchaseOrderAction,
} from "@/app/(dashboard)/compras/ordenes/actions";

type Props = {
  purchaseOrderId: string;
  status: string;
};

export function PurchaseOrderActions({
  purchaseOrderId,
  status,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleSave() {
    startTransition(async () => {
      const result =
        await savePurchaseOrderAction(
          purchaseOrderId
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Borrador guardado.");

      router.refresh();
    });
  }

  function handleSend() {
    if (
      !window.confirm(
        "¿Desea enviar esta orden a recepción?"
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result =
        await sendPurchaseOrderAction(
          purchaseOrderId
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push("/compras/ordenes");

      router.refresh();
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        "¿Desea eliminar completamente esta orden?"
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result =
        await deletePurchaseOrderAction(
          purchaseOrderId
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push("/compras/ordenes");

      router.refresh();
    });
  }

  function handleReception() {
    router.push("/compras/recepcion");
  }

  // -----------------------------
  // BORRADOR
  // -----------------------------

  if (status === "draft") {
    return (
      <div className="flex flex-wrap gap-3">

        <Button
          disabled={isPending}
          onClick={handleSave}
          variant="outline"
        >
          Guardar borrador
        </Button>

        <Button
          disabled={isPending}
          onClick={handleSend}
        >
          Enviar orden
        </Button>

        <Button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Eliminar
        </Button>

      </div>
    );
  }

  // -----------------------------
  // ENVIADA
  // -----------------------------

  if (status === "sent") {
    return (
      <div className="flex gap-3">

        <Button
          variant="outline"
          onClick={handleReception}
        >
          Ir a Recepción
        </Button>

      </div>
    );
  }

  // -----------------------------
  // RECIBIDA
  // -----------------------------

  if (status === "received") {
    return (
      <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
        Esta orden ya fue recibida.
      </div>
    );
  }

  return null;
}
