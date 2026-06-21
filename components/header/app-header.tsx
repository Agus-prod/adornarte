import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  Bell,
  UserCircle2,
} from "lucide-react";

export async function AppHeader() {
  const user =
    await getCurrentUser();

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/60
        bg-white/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-8
          py-4
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-bold
              bg-gradient-to-r
              from-pink-500
              to-fuchsia-500
              bg-clip-text
              text-transparent
            "
          >
            AdornArte
          </h1>

          <p className="text-sm text-gray-500">
            Sistema de Gestión
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-3
              text-gray-500
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
              hover:text-pink-600
            "
          >
            <Bell size={18} />
          </button>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-gray-100
              bg-white
              px-4
              py-2
              shadow-sm
            "
          >
            <div
              className="
                rounded-full
                bg-pink-100
                p-2
                text-pink-600
              "
            >
              <UserCircle2 size={24} />
            </div>

            <div>
              <p className="font-medium text-sm">
                {user?.email ??
                  "Usuario"}
              </p>

              <p className="text-xs text-gray-500">
                Administrador
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}