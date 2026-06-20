import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-bold text-pink-500">
        AdornArte
      </h1>

      <div className="flex items-center gap-4">
        <button>🔔</button>

        <div className="text-right">
          <p className="font-medium">
            {user?.email ?? "Usuario"}
          </p>

          <p className="text-sm text-gray-500">
            owner
          </p>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}