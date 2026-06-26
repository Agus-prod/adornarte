import { PageHeader } from "@/components/ui/page-header";
import { SupplierCreateContainer } from "@/components/purchases/supplier-create-container";

export default function NewSupplierPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo proveedor"
        description="Registra un nuevo proveedor."
      />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <SupplierCreateContainer />
      </div>
    </div>
  );
}