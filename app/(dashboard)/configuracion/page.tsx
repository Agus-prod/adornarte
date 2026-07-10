import Link from "next/link";
import {
  TicketPercent,
  Users,
  Store,
  PackagePlus,
} from "lucide-react";

const sections = [
  {
    title: "Commerce",
    description:
      "Tienda, bancos, WhatsApp, facturacion y textos del catalogo.",
    href: "/configuracion/commerce",
    icon: Store,
  },
  {
    title: "Cupones",
    description:
      "Promociones generales y cupones personalizados por cliente.",
    href: "/configuracion/cupones",
    icon: TicketPercent,
  },
  {
    title: "Combos",
    description:
      "Reglas de combos y descuentos por cantidad para el catalogo.",
    href: "/configuracion/combos",
    icon: PackagePlus,
  },
  {
    title: "Perfiles y roles",
    description:
      "Usuarios, cajeros, administradores y visibilidad por rol.",
    href: "/configuracion/perfiles",
    icon: Users,
  },
];

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configuracion
        </h1>
        <p className="mt-2 text-gray-500">
          Centro de control de AdornArte.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Icon size={22} />
              </div>
              <h2 className="mt-4 text-xl font-bold">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {section.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
