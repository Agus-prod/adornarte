export type ProductEditorTab =
  | "info"
  | "variants"
  | "images"
  | "attributes"
  | "publication";

export const productEditorTabs: {
  value: ProductEditorTab;
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

export function isProductEditorTab(
  value: string | null
): value is ProductEditorTab {
  return productEditorTabs.some(
    (tab) => tab.value === value
  );
}
