import { ReactNode } from "react";

type Props = {
  headers: string[];
  children: ReactNode;
};

export function EntityTable({
  headers,
  children,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}