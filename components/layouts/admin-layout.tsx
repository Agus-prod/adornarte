import { AppHeader } from "@/components/header/app-header";
import { Sidebar } from "@/components/sidebar/sidebar";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-white
        to-pink-50/40
      "
    >
      <AppHeader />

      <div className="flex">
        <Sidebar />

        <main
          className="
            flex-1
            p-4
            md:p-6
            xl:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}