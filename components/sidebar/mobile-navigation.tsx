"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  Barcode,
  Building2,
  Calculator,
  FileBarChart,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  canAccessPath,
  type UserRole,
} from "@/lib/auth/roles";

const groups = [
  {
    title: "Inicio",
    links: [
      {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Ventas",
    links: [
      {
        href: "/pos",
        label: "Punto de Venta",
        icon: ShoppingCart,
      },
      {
        href: "/ventas",
        label: "Ventas",
        icon: BarChart3,
      },
      {
        href: "/caja",
        label: "Caja",
        icon: Wallet,
      },
      {
        href: "/contabilidad",
        label: "Contabilidad",
        icon: Calculator,
      },
    ],
  },
  {
    title: "Inventario",
    links: [
      {
        href: "/inventario/productos",
        label: "Productos",
        icon: Package,
      },
      {
        href: "/inventario/movimientos",
        label: "Movimientos",
        icon: ArrowLeftRight,
      },
      {
        href: "/inventario/conteo",
        label: "Conteo",
        icon: Barcode,
      },
    ],
  },
  {
    title: "Clientes y compras",
    links: [
      {
        href: "/clientes",
        label: "Clientes",
        icon: Users,
      },
      {
        href: "/compras",
        label: "Compras",
        icon: Truck,
      },
      {
        href: "/compras/proveedores",
        label: "Proveedores",
        icon: Building2,
      },
    ],
  },
  {
    title: "Sistema",
    links: [
      {
        href: "/reportes",
        label: "Reportes",
        icon: FileBarChart,
      },
      {
        href: "/configuracion",
        label: "Configuracion",
        icon: Settings,
      },
    ],
  },
];

type Props = {
  role: UserRole;
};

export function MobileNavigation({
  role,
}: Props) {
  const pathname = usePathname();
  const menuRef =
    useRef<HTMLDetailsElement>(null);
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) =>
        canAccessPath(role, link.href)
      ),
    }))
    .filter(
      (group) => group.links.length > 0
    );

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  return (
    <details
      ref={menuRef}
      className="group relative lg:hidden"
    >
      <summary
        aria-label="Abrir navegacion"
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-2xl border border-pink-100 bg-white px-3 text-sm font-semibold text-zinc-800 shadow-sm"
      >
        <Menu className="size-5 group-open:hidden" />
        <X className="hidden size-5 group-open:block" />
        Menu
      </summary>

      <div className="fixed inset-x-3 top-[4.75rem] z-50 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-pink-100 bg-white p-4 shadow-2xl shadow-pink-100/70">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
          Navegacion
        </p>

        <div className="mt-3 grid gap-4">
          {visibleGroups.map((group) => (
            <section key={group.title}>
              <h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {group.title}
              </h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" &&
                      pathname.startsWith(
                        `${link.href}/`
                      ));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={
                        isActive
                          ? "flex min-h-12 items-center gap-2 rounded-2xl bg-pink-100 px-3 text-sm font-semibold text-pink-700"
                          : "flex min-h-12 items-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 px-3 text-sm font-semibold text-zinc-700"
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="min-w-0 leading-tight">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}
