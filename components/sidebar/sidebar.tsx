import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-6 text-xl font-bold text-pink-500">
        AdornArte
      </h2>

      <nav className="space-y-2">
        <Link href="/">
          Dashboard
        </Link>

        <br />

        <Link href="/inventario/productos">
          Productos
        </Link>

        <br />

        <Link href="/inventario/movimientos">
  Movimientos
</Link>
      </nav>
    </aside>
  );
}