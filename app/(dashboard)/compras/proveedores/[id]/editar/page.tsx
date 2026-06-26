import { notFound } from "next/navigation";

import { getSupplier } from "@/lib/purchases/get-supplier";

import { PageHeader } from "@/components/ui/page-header";
import { SupplierEditContainer } from "@/components/purchases/supplier-edit-container";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSupplierPage({
  params,
}: Props) {
  const { id } = await params;

  const supplier =
    await getSupplier(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar proveedor"
        description="Actualiza la información del proveedor."
      />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <SupplierEditContainer
          supplierId={id}
          defaultValues={{
            name: supplier.name,
            contact_name:
              supplier.contact_name ??
              "",
            phone:
              supplier.phone ?? "",
            email:
              supplier.email ?? "",
            address:
              supplier.address ??
              "",
            rtn:
              supplier.rtn ?? "",
            notes:
              supplier.notes ??
              "",
            is_active:
              supplier.is_active,
          }}
        />
      </div>
    </div>
  );
}