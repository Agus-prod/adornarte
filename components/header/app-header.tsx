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
        flex items-center
        justify-between
        border-b
        bg-white
        px-6
        py-4
      "
    >
      <div>
        <h1 className="text-2xl font-bold text-pink-500">
          AdornArte
        </h1>

        <p className="text-sm text-gray-500">
          Sistema de Gestión
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button
          className="
            rounded-xl
            p-2
            text-gray-500
            transition-all
            hover:bg-pink-50
            hover:text-pink-600
          "
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="
              rounded-full
              bg-pink-100
              p-2
              text-pink-600
            "
          >
            <UserCircle2 size={28} />
          </div>

          <div>
            <p className="font-medium">
              {user?.email ??
                "Usuario"}
            </p>

            <p className="text-sm text-gray-500">
              Administrador
            </p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}