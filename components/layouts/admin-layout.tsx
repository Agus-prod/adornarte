import { AppHeader } from "@/components/header/app-header";
import { Sidebar } from "@/components/sidebar/sidebar";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <AppHeader />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}