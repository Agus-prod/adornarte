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

      <div className="flex min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
        <Sidebar />

        <main
          className="
            flex-1
            min-w-0
            overflow-y-visible
            p-3
            sm:p-4
            md:p-6
            xl:p-8
            lg:overflow-y-auto
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
