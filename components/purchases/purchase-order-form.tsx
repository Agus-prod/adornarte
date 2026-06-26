"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  purchaseOrderSchema,
  PurchaseOrderFormValues,
  defaultPurchaseOrderValues,
} from "@/lib/purchases/purchase-order-schema";

import { FormCard } from "@/components/forms/form-card";
import { FormSection } from "@/components/forms/form-section";
import { FormActions } from "@/components/forms/form-actions";
import { Button } from "@/components/ui/button";

type Props = {
  loading?: boolean;
  defaultValues?: PurchaseOrderFormValues;
  submitLabel?: string;
  onSubmit: (
    values: PurchaseOrderFormValues
  ) => void;
};

export function PurchaseOrderForm({
  loading = false,
  defaultValues = defaultPurchaseOrderValues,
  submitLabel = "Guardar Orden",
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(
      purchaseOrderSchema
    ),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormCard
        title="Nueva Orden de Compra"
        description="Complete la información de la orden."
      >
        <FormSection title="Información General">
          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Proveedor
              </label>

              <input
                {...register("supplier_id")}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="UUID del proveedor (temporal)"
              />

              {errors.supplier_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.supplier_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Fecha
              </label>

              <input
                type="date"
                {...register("order_date")}
                className="w-full rounded-xl border px-4 py-3"
              />

              {errors.order_date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.order_date.message}
                </p>
              )}
            </div>

          </div>
        </FormSection>

        <FormSection title="Observaciones">
          <textarea
            rows={4}
            {...register("notes")}
            className="w-full rounded-xl border px-4 py-3"
          />
        </FormSection>

        <FormActions>

          <Button
            type="button"
            variant="secondary"
          >
            Cancelar
          </Button>

          <Button
            loading={loading}
            type="submit"
          >
            {submitLabel}
          </Button>

        </FormActions>

      </FormCard>
    </form>
  );
}