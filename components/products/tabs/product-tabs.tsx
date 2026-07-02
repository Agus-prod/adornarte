"use client";

import {
  productEditorTabs,
  type ProductEditorTab,
} from "./product-editor-tabs";

type Props = {
  value: ProductEditorTab;
  onChange: (
    tab: ProductEditorTab
  ) => void;
};

export function ProductTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b pb-3">
      {productEditorTabs.map((tab) => (
        <button
          type="button"
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
