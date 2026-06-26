import Link from "next/link";
import { Pencil } from "lucide-react";

import { Supplier } from "@/lib/purchases/get-suppliers";
import { StatusBadge } from "@/components/ui/status-badge";
import { SupplierStatusButton } from "./supplier-status-button";

type Props = {
  suppliers: Supplier[];
};

export function SuppliersTable({ suppliers }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Nombre</th>
            <th className="p-4 text-left">Contacto</th>
            <th className="p-4 text-left">Teléfono</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="border-t transition hover:bg-pink-50"
            >
              <td className="p-4 font-medium">{supplier.name}</td>

              <td className="p-4">
                {supplier.contact_name || "-"}
              </td>

              <td className="p-4">
                {supplier.phone || "-"}
              </td>

              <td className="p-4">
                <StatusBadge
                  variant={supplier.is_active ? "success" : "danger"}
                >
                  {supplier.is_active ? "Activo" : "Inactivo"}
                </StatusBadge>
              </td>

              <td className="p-4">
                <div className="flex items-center justify-center gap-2">

                  <Link
                    href={`/compras/proveedores/${supplier.id}/editar`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
                    title="Editar proveedor"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>

                  <SupplierStatusButton
                    supplierId={supplier.id}
                    isActive={supplier.is_active}
                  />

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}