"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  supplierSchema,
  SupplierFormValues,
} from "@/lib/purchases/supplier-schema";

import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormSwitch } from "@/components/forms/form-switch";
import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: (
    values: SupplierFormValues
  ) => void | Promise<void>;

  loading?: boolean;

  defaultValues?: SupplierFormValues;

  submitLabel?: string;
};

export function SupplierForm({
  onSubmit,
  loading = false,
  defaultValues,
  submitLabel = "Guardar proveedor",
}: Props) {
  const {
    control,
    handleSubmit,
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),

    defaultValues: defaultValues ?? {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  address: "",
  rtn: "",
  notes: "",
  is_active: true,
},
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormInput
        control={control}
        name="name"
        label="Proveedor"
        placeholder="Nombre del proveedor"
      />

      <FormInput
        control={control}
        name="contact_name"
        label="Contacto"
        placeholder="Persona de contacto"
      />

      <FormInput
        control={control}
        name="phone"
        label="Teléfono"
        placeholder="Teléfono"
      />

      <FormInput
        control={control}
        name="email"
        label="Correo"
        type="email"
        placeholder="correo@empresa.com"
      />

      <FormInput
        control={control}
        name="rtn"
        label="RTN"
        placeholder="RTN"
      />

      <FormTextarea
        control={control}
        name="address"
        label="Dirección"
        placeholder="Dirección"
      />

      <FormTextarea
        control={control}
        name="notes"
        label="Notas"
        placeholder="Observaciones"
      />

      <FormSwitch
        control={control}
        name="is_active"
        label="Proveedor activo"
        description="El proveedor podrá utilizarse en órdenes de compra."
      />

      <div className="flex justify-end">
      <Button
  type="submit"
  loading={loading}
>
  {submitLabel}
</Button>
      </div>
    </form>
  );
}