"use client";

import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border px-3 py-2 hover:bg-gray-100"
      title="Cerrar sesión"
    >
      🚪
    </button>
  );
}