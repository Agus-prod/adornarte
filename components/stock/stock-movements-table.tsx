type Movement = {
  id: string;
  movement_type: string;
  quantity: number;
  notes: string | null;
  created_at: string;

  products?: {
    name: string;
  } | null;

  profiles?: {
    full_name: string | null;
  } | null;
};

function getMovementBadge(
  movementType: string
) {
  switch (movementType) {
    case "ENTRADA":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Entrada
        </span>
      );

    case "SALIDA":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
          Salida
        </span>
      );

    case "AJUSTE":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
          Ajuste
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {movementType}
        </span>
      );
  }
}

export function StockMovementsTable({
  movements,
}: {
  movements: Movement[];
}) {
  if (movements.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
        No hay movimientos registrados.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {movements.map((movement) => (
          <article
            key={movement.id}
            className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">
                  {movement.products?.name ?? "-"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {movement.profiles?.full_name ?? "Sistema"}
                </p>
              </div>
              {getMovementBadge(
                movement.movement_type
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  Cantidad
                </p>
                <p className="mt-1 font-bold">
                  {movement.quantity}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  Fecha
                </p>
                <p className="mt-1 text-xs font-semibold">
                  {new Date(
                    movement.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {movement.notes ? (
              <p className="mt-3 rounded-2xl bg-pink-50 p-3 text-sm text-zinc-600">
                {movement.notes}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div
        className="
          hidden
          overflow-hidden
          rounded-3xl
          border
          bg-white
          shadow-sm
          md:block
        "
      >
        <table className="w-full">
        <thead>
          <tr
            className="
              border-b
              bg-gray-50
              text-sm
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            <th className="p-4 text-left">
  Producto
</th>

<th className="p-4 text-left">
  Usuario
</th>

<th className="p-4 text-left">
  Tipo
</th>

            <th className="p-4 text-left">
              Cantidad
            </th>

            <th className="p-4 text-left">
              Notas
            </th>

            <th className="p-4 text-left">
              Fecha
            </th>
          </tr>
        </thead>

        <tbody>
          {movements.map(
            (movement) => (
              <tr
                key={movement.id}
                className="
                  border-b
                  transition-colors
                  hover:bg-pink-50/40
                "
              >
                <td className="p-4 font-semibold">
  {movement.products?.name ?? "-"}
</td>

<td className="p-4">
  {movement.profiles?.full_name ??
    "Sistema"}
</td>

<td className="p-4">
  {getMovementBadge(
    movement.movement_type
  )}
</td>

                <td className="p-4 font-medium">
                  {movement.quantity}
                </td>

                <td className="p-4 text-gray-600">
                  {movement.notes ??
                    "-"}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(
                    movement.created_at
                  ).toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
        </table>
      </div>
    </>
  );
}
