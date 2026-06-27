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

        <p className="mt-2 text-gray-500">
          Gestiona proveedores, órdenes de compra y recepción de mercancía.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <Link
          href="/compras/proveedores"
          className="
            rounded-2xl
            border
            bg-white
            p-6
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
          "
        >
          <Building2
            className="mb-4 text-pink-500"
            size={34}
          />

          <h2 className="text-lg font-semibold">
            Proveedores
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Administrar proveedores.
          </p>
        </Link>

        <Link
          href="/compras/ordenes"
          className="
            rounded-2xl
            border
            bg-white
            p-6
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
          "
        >
          <ClipboardList
            className="mb-4 text-pink-500"
            size={34}
          />

          <h2 className="text-lg font-semibold">
            Órdenes de compra
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Crear y administrar órdenes de compra.
          </p>
        </Link>

        <Link
  href="/compras/recepcion"
  className="
    rounded-2xl
    border
    bg-white
    p-6
    shadow-sm
    transition
    hover:-translate-y-1
    hover:shadow-md
  "
>
  <Truck
    className="mb-4 text-pink-500"
    size={34}
  />

  <h2 className="text-lg font-semibold">
    Recepción
  </h2>

  <p className="mt-2 text-sm text-gray-500">
    Recibir mercancía pendiente.
  </p>
</Link>

      </div>

    </div>
  );
}