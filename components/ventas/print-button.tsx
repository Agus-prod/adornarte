"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="
        rounded-xl
        bg-pink-500
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-pink-600
      "
    >
      🖨️ Imprimir Ticket
    </button>
  );
}