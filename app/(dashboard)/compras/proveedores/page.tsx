import Link from "next/link";

import { Plus } from "lucide-react";

import { getSuppliers } from "@/lib/purchases/get-suppliers";

import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { SuppliersTable } from "@/components/purchases/suppliers-table";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">

      <PageHeader
        title="Proveedores"
        description="Administra los proveedores del negocio."
        action={
          <Link
            href="/compras/proveedores/nuevo"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-pink-500
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-pink-600
            "
          >
            <Plus size={18} />
            Nuevo proveedor
          </Link>
        }
      />

      <SearchInput
        placeholder="Buscar proveedor..."
      />

      {suppliers.length === 0 ? (
        <EmptyState
          title="No hay proveedores"
          description="Comienza creando el primer proveedor."
        />
      ) : (
        <SuppliersTable
          suppliers={suppliers}
        />
      )}

    </div>
  );
}