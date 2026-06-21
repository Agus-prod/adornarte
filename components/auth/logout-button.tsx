"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  return (
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      className="
        flex items-center gap-2
        rounded-xl
        border
        px-4 py-2
        text-sm font-medium
        text-gray-700
        transition-all
        hover:bg-red-50
        hover:text-red-600
        hover:border-red-200
      "
    >
      <LogOut size={16} />
      Salir
    </button>
  );
}