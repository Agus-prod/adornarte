export type ProductStatus =
  | "draft"
  | "published"
  | "hidden"
  | "archived";

export type ProductVariant = {
  id: string;
  product_id: string;

  name: string;

  sku: string | null;

  barcode: string | null;

  cost_price: number;

  sale_price: number;

  stock: number;

  active: boolean;

  is_default: boolean;
};

export type ProductImage = {
  id: string;

  product_id: string;

  variant_id: string | null;

  url: string;

  alt: string | null;

  is_primary: boolean;

  sort_order: number;
};

export type ProductAttribute = {
  id: string;

  name: string;
};

export type AttributeValue = {
  id: string;

  attribute_id: string;

  value: string;
};