"use client";

type Props = {
  customerName: string;
  phone: string | null;
  balance: number;
};

function getWhatsappUrl(
  phone: string,
  message: string
) {
  const cleanPhone = phone.replace(
    /\D/g,
    ""
  );

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function CustomerStatementActions({
  customerName,
  phone,
  balance,
}: Props) {
  const message = `Hola ${customerName}, te saludamos de AdornArte. Te recordamos que tu saldo pendiente es de L ${balance.toFixed(2)}.`;
  const whatsappUrl = phone
    ? getWhatsappUrl(phone, message)
    : null;

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="min-h-10 rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Imprimir estado
      </button>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
        >
          Enviar recordatorio
        </a>
      ) : (
        <span className="inline-flex min-h-10 items-center rounded-2xl border px-4 text-sm font-semibold text-gray-500">
          Sin WhatsApp
        </span>
      )}
    </div>
  );
}
