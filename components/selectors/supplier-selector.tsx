"use client";

type Supplier = {
  id: string;
  name: string;
};

type Props = {
  suppliers: Supplier[];
  value?: string;
  onChange: (value: string) => void;
};

export function SupplierSelector({
  suppliers,
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-3
        shadow-sm
        focus:border-pink-500
        focus:ring-2
        focus:ring-pink-200
      "
    >
      <option value="">
        Seleccione un proveedor
      </option>

      {suppliers.map((supplier) => (
        <option
          key={supplier.id}
          value={supplier.id}
        >
          {supplier.name}
        </option>
      ))}
    </select>
  );
}