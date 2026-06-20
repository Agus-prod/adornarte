export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-white">
        <div className="p-4 font-bold text-pink-500 text-xl">
          AdornArte
        </div>

        <nav className="p-4 space-y-2">
          <div>📊 Dashboard</div>
          <div>🛒 POS</div>
          <div>📦 Inventario</div>
          <div>👥 Clientes</div>
          <div>🚚 Compras</div>
          <div>🧾 Facturación</div>
          <div>💰 Caja</div>
          <div>📈 Reportes</div>
          <div>⚙️ Configuración</div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}