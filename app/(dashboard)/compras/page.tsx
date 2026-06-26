import Link from "next/link";
import {
  Truck,
  Building2,
  ClipboardList,
} from "lucide-react";

export default function ComprasPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Compras
        </h1>

        <p className="text-gray-500 mt-2">
          Gestiona proveedores, órdenes de compra y recepción de mercancía.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <Link
          href="/compras/proveedores"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <Building2
            className="text-pink-500 mb-4"
            size={34}
          />

          <h2 className="font-semibold text-lg">
            Proveedores
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Administrar proveedores.
          </p>
        </Link>

        <div className="rounded-2xl border bg-white p-6 opacity-60">
          <ClipboardList
            className="text-pink-500 mb-4"
            size={34}
          />

          <h2 className="font-semibold text-lg">
            Órdenes de compra
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Próximamente.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 opacity-60">
          <Truck
            className="text-pink-500 mb-4"
            size={34}
          />

          <h2 className="font-semibold text-lg">
            Recepción
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Próximamente.
          </p>
        </div>

      </div>

    </div>
  );
}