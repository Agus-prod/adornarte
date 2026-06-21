type Movement = {
  id: string;
  movement_type: string;
  quantity: number;
  notes: string | null;
  created_at: string;

  products?: {
    name: string;
  } | null;
};

export function StockMovementsTable({
  movements,
}: {
  movements: Movement[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-4 text-left">
              Producto
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
                className="border-b"
              >
                <td className="p-4">
                  {movement.products?.name ??
                    "-"}
                </td>

                <td className="p-4">
                  {movement.movement_type}
                </td>

                <td className="p-4">
                  {movement.quantity}
                </td>

                <td className="p-4">
                  {movement.notes ??
                    "-"}
                </td>

                <td className="p-4">
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
  );
}