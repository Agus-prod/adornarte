import { SidebarLink } from "./sidebar-link";
import { AdornarteBrandMark } from "@/components/brand/adornarte-brand-mark";
import {
  ArrowLeftRight,
  BarChart3,
  Barcode,
  Building2,
  Calculator,
  FileBarChart,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  canAccessPath,
  type UserRole,
} from "@/lib/auth/roles";

type Props = {
  role: UserRole;
};

const groups = [
  {
    title: "Inicio",
    links: [
      {
        href: "/",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    title: "Inventario",
    links: [
      {
        href: "/inventario/productos",
        label: "Productos",
        icon: <Package size={18} />,
      },
      {
        href: "/inventario/movimientos",
        label: "Movimientos",
        icon: <ArrowLeftRight size={18} />,
      },
      {
        href: "/inventario/conteo",
        label: "Conteo",
        icon: <Barcode size={18} />,
      },
    ],
  },
  {
    title: "Compras",
    links: [
      {
        href: "/compras",
        label: "Inicio",
        icon: <Truck size={18} />,
      },
      {
        href: "/compras/proveedores",
        label: "Proveedores",
        icon: <Building2 size={18} />,
      },
    ],
  },
  {
    title: "Clientes",
    links: [
      {
        href: "/clientes",
        label: "Clientes",
        icon: <Users size={18} />,
      },
    ],
  },
  {
    title: "Ventas",
    links: [
      {
        href: "/pos",
        label: "Punto de Venta",
        icon: <ShoppingCart size={18} />,
      },
      {
        href: "/ventas",
        label: "Ventas",
        icon: <BarChart3 size={18} />,
      },
    ],
  },
  {
    title: "Finanzas",
    links: [
      {
        href: "/caja",
        label: "Caja",
        icon: <Wallet size={18} />,
      },
      {
        href: "/contabilidad",
        label: "Contabilidad",
        icon: <Calculator size={18} />,
      },
    ],
  },
  {
    title: "Reportes",
    links: [
      {
        href: "/reportes",
        label: "Reportes",
        icon: <FileBarChart size={18} />,
      },
    ],
  },
  {
    title: "Configuracion",
    links: [
      {
        href: "/configuracion",
        label: "General",
        icon: <Settings size={18} />,
      },
    ],
  },
];

export function Sidebar({
  role,
}: Props) {
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

  return (
    <aside
      data-app-chrome
      className="hidden w-72 overflow-hidden px-5 py-6 lg:block"
    >
      <div className="h-full max-h-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-7">
          <AdornarteBrandMark
            subtitle="Panel interno"
            size="md"
          />
        </div>

        <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Navegacion
        </h2>

        <div className="h-[calc(100%-6.5rem)] space-y-6 overflow-y-auto pr-1">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group.title}
              </p>

              {group.links.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
