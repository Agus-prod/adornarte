import { SidebarLink } from "./sidebar-link";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-5">
      <h2 className="mb-8 text-2xl font-bold text-pink-500">
        AdornArte
      </h2>

      <nav className="space-y-2">
<SidebarLink
  href="/"
  icon={<LayoutDashboard size={18} />}
>
  Dashboard
</SidebarLink>

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
      </nav>
    </aside>
  );
}