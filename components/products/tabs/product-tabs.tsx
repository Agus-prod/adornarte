"use client";

type Tab =
  | "info"
  | "variants"
  | "images"
  | "attributes"
  | "publication";

type Props = {
  value: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: {
  value: Tab;
  label: string;
}[] = [
  {
    value: "info",
    label: "Información",
  },
  {
    value: "variants",
    label: "Variantes",
  },
  {
    value: "images",
    label: "Imágenes",
  },
  {
    value: "attributes",
    label: "Atributos",
  },
  {
    value: "publication",
    label: "Publicación",
  },
];

export function ProductTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition

          ${
            value === tab.value
              ? "bg-pink-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}