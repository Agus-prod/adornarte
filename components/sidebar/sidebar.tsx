import { SidebarLink } from "./sidebar-link";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ShoppingCart,
  BarChart3,
  Users,
  FileBarChart,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside
      className="
        hidden
        lg:block
        w-72
        px-5
        py-6
      "
    >
      <div
        className="
          sticky
          top-24
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

        <div className="space-y-6">
          <div>
            <p
              className="
                mb-2
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Inicio
            </p>

            <SidebarLink
              href="/"
              icon={<LayoutDashboard size={18} />}
            >
              Dashboard
            </SidebarLink>
          </div>

          <div>
            <p
              className="
                mb-2
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
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

          <div>
            <p
              className="
                mb-2
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Clientes
            </p>

            <SidebarLink
              href="/clientes"
              icon={<Users size={18} />}
            >
              Clientes
            </SidebarLink>
          </div>

          <div>
            <p
              className="
                mb-2
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
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

          <div>
            <p
              className="
                mb-2
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Reportes
            </p>

            <SidebarLink
              href="/reportes"
              icon={<FileBarChart size={18} />}
            >
              Reportes
            </SidebarLink>
          </div>
        </div>
      </div>
    </aside>
  );
}