import { SidebarLink } from "./sidebar-link";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ShoppingCart,
  BarChart3,
  Users,
  FileBarChart,
  Wallet,
  Truck,
  Building2,
  Settings,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside
      data-app-chrome
      className="
        hidden
        lg:block
        w-72
        px-5
        py-6
        overflow-hidden
      "
    >
      <div
        className="
          h-full
          max-h-full
          overflow-hidden
          rounded-3xl
          border
          border-white/60
          bg-white/70
          p-5
          shadow-sm
          backdrop-blur-xl
        "
      >
        <h2
          className="
            mb-8
            text-xl
            font-bold
            text-pink-500
          "
        >
          Navegación
        </h2>

        <div className="h-[calc(100%-3.5rem)] space-y-6 overflow-y-auto pr-1">

          {/* DASHBOARD */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Inicio
            </p>

            <SidebarLink
              href="/"
              icon={<LayoutDashboard size={18} />}
            >
              Dashboard
            </SidebarLink>
          </div>

          {/* INVENTARIO */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Inventario
            </p>

            <SidebarLink
              href="/inventario/productos"
              icon={<Package size={18} />}
            >
              Productos
            </SidebarLink>

            <SidebarLink
              href="/inventario/movimientos"
              icon={<ArrowLeftRight size={18} />}
            >
              Movimientos
            </SidebarLink>
          </div>

          {/* COMPRAS */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Compras
            </p>

            <SidebarLink
              href="/compras"
              icon={<Truck size={18} />}
            >
              Inicio
            </SidebarLink>

            <SidebarLink
              href="/compras/proveedores"
              icon={<Building2 size={18} />}
            >
              Proveedores
            </SidebarLink>
          </div>

          {/* CLIENTES */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Clientes
            </p>

            <SidebarLink
              href="/clientes"
              icon={<Users size={18} />}
            >
              Clientes
            </SidebarLink>
          </div>

          {/* VENTAS */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Ventas
            </p>

            <SidebarLink
              href="/pos"
              icon={<ShoppingCart size={18} />}
            >
              Punto de Venta
            </SidebarLink>

            <SidebarLink
              href="/ventas"
              icon={<BarChart3 size={18} />}
            >
              Ventas
            </SidebarLink>
          </div>

          {/* FINANZAS */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Finanzas
            </p>

            <SidebarLink
              href="/caja"
              icon={<Wallet size={18} />}
            >
              Caja
            </SidebarLink>
          </div>

          {/* REPORTES */}

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Reportes
            </p>

            <SidebarLink
              href="/reportes"
              icon={<FileBarChart size={18} />}
            >
              Reportes
            </SidebarLink>
          </div>

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Configuracion
            </p>

            <SidebarLink
              href="/configuracion"
              icon={<Settings size={18} />}
            >
              General
            </SidebarLink>
          </div>

        </div>
      </div>
    </aside>
  );
}
