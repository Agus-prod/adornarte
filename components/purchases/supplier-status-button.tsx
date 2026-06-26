"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Ban, Check } from "lucide-react";

import { toggleSupplierStatusAction } from "@/app/(dashboard)/compras/proveedores/actions";

type Props = {
  supplierId: string;
  isActive: boolean;
};

export function SupplierStatusButton({
  supplierId,
  isActive,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleSupplierStatusAction(supplierId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      title={
        isActive
          ? "Desactivar proveedor"
          : "Activar proveedor"
      }
      className={`
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        transition-all
        hover:scale-105
        active:scale-95
        disabled:opacity-50

        ${
          isActive
            ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
            : "border-green-600 bg-green-600 text-white hover:bg-green-700"
        }
      `}
    >
      {isActive ? (
        <Ban size={20} strokeWidth={2.5} />
      ) : (
        <Check size={20} strokeWidth={2.5} />
      )}
    </button>
  );
}