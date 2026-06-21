import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

type Sale = {
  id: string;
  total: number;
  created_at: string;
};

export default async function SalesPage() {
  const profile =
    await getCurrentProfile();

  const supabase =
    await createClient();

  const { data: sales } =
    await supabase
      .from("sales")
      .select(`
        id,
        total,
        created_at
      `)
      .eq(
        "organization_id",
        profile?.organization_id
      )
      .order("created_at", {
        ascending: false,
      });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
  Ventas
</h1>

        <p className="mt-2 text-gray-500">
          Historial de ventas realizadas.
        </p>
      </div>

      <div
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/80
          p-6
          shadow-sm
          backdrop-blur-xl
        "
      >
        {!sales?.length ? (
          <p className="text-gray-500">
            No hay ventas registradas.
          </p>
        ) : (
          <div className="space-y-3">
            {sales.map(
              (sale: Sale) => (
                <Link
                  key={sale.id}
                  href={`/ventas/${sale.id}`}
                  className="
                    block
                    rounded-2xl
                    bg-gray-50
                    p-4
                    transition-all
                    hover:-translate-y-1
                    hover:bg-white
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        Venta
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          sale.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-pink-600">
                        L{" "}
                        {Number(
                          sale.total
                        ).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-pink-500">
                        Ver detalle →
                      </p>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}