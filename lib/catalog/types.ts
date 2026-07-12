import type { ProductAttribute } from "@/lib/catalog/repositories/attribute-repository";
import type { CatalogBrand } from "@/lib/catalog/repositories/brand-repository";
import type { CatalogCategory } from "@/lib/catalog/repositories/category-repository";
import type {
  CatalogCart,
  CatalogCartItem,
} from "@/lib/catalog/repositories/cart-repository";
import type { Collection } from "@/lib/catalog/repositories/collection-repository";
import type {
  CatalogCustomer,
  CatalogCustomerAddress,
} from "@/lib/catalog/repositories/customer-repository";
import type { ProductImage } from "@/lib/catalog/repositories/image-repository";
import type { CatalogPayment } from "@/lib/catalog/repositories/payment-repository";
import type {
  CatalogOrder,
  CatalogOrderItem,
} from "@/lib/catalog/repositories/order-repository";
import type { ProductPublication } from "@/lib/catalog/repositories/publication-repository";
import type { CatalogPromotion } from "@/lib/catalog/repositories/promotion-repository";
import type { ProductVariant } from "@/lib/catalog/repositories/variant-repository";
import type { Tables } from "@/lib/database.types";

export type CatalogProductStatus =
  | "draft"
  | "published"
  | "hidden"
  | "scheduled";

export type CatalogCollection =
  Collection;

export type CatalogCategorySummary =
  Pick<
    CatalogCategory,
    | "id"
    | "name"
    | "slug"
    | "description"
    | "image_url"
    | "banner_url"
    | "parent_id"
  >;

export type CatalogBrandSummary =
  Pick<
    CatalogBrand,
    | "id"
    | "name"
    | "slug"
    | "description"
    | "logo_url"
    | "banner_url"
  >;

export type CatalogProduct =
  Tables<"products">;

export type CatalogProductSeo = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  openGraphImageUrl: string | null;
};

export type CatalogProductSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  imageUrl: string | null;
  regularPrice: number | null;
  salePrice: number | null;
  isFeatured: boolean;
};

export type CatalogComboProduct = CatalogProductSummary & {
  quantity: number;
};

export type CatalogComboSummary = {
  id: string;
  name: string;
  description: string | null;
  regularPrice: number;
  offerPrice: number;
  savings: number;
  products: CatalogComboProduct[];
};

export type CatalogSearchResult =
  CatalogProductSummary & {
    matchedFields: string[];
  };

export type CatalogProductFilters = {
  brandId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  tone?: string;
  finish?: string;
  inStock?: boolean;
  onOffer?: boolean;
};

export type CatalogFilterOptions = {
  brands: CatalogBrand[];
  categories: CatalogCategory[];
  colors: string[];
  tones: string[];
  finishes: string[];
};

export type CatalogHomeData = {
  heroProduct: CatalogProductSummary | null;
  featuredProducts: CatalogProductSummary[];
  newProducts: CatalogProductSummary[];
  offerProducts: CatalogProductSummary[];
  collections: CatalogCollection[];
  brands: CatalogBrand[];
  combos: CatalogComboSummary[];
};

export type CatalogCartTotals = {
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
};

export type CatalogCartDetail = {
  cart: CatalogCart;
  items: CatalogCartItem[];
  totals: CatalogCartTotals;
};

export type CatalogPaymentMethod =
  | "stripe"
  | "paypal"
  | "transfer"
  | "cash_on_delivery";

export type CatalogBankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: string | null;
  currency: string;
};

export type CatalogSettingsView = {
  shopName: string;
  shopTagline: string | null;
  shopDescription: string | null;
  shopBannerUrl: string | null;
  billingName: string | null;
  billingRtn: string | null;
  billingAddress: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
  whatsappNumber: string | null;
  orderWhatsappRecipient: string | null;
  bankAccounts: CatalogBankAccount[];
  checkoutNotes: string | null;
  privacyPolicyUrl: string | null;
  termsUrl: string | null;
};

export type { CatalogPayment };

export type CatalogOrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CatalogOrderDetail = {
  order: CatalogOrder;
  items: CatalogOrderItem[];
  payments: CatalogPayment[];
};

export type CatalogCustomerAccount = {
  customer: CatalogCustomer;
  addresses: CatalogCustomerAddress[];
  orders: CatalogOrder[];
};

export type CatalogRecommendations = {
  related: CatalogProductSummary[];
  crossSelling: CatalogProductSummary[];
  upselling: CatalogProductSummary[];
  lastViewed: CatalogProductSummary[];
};

export type CatalogAnalyticsSummary = {
  views: number;
  cartAdds: number;
  orders: number;
  revenue: number;
  conversionRate: number;
};

export type CatalogPromotionDiscount = {
  promotion: CatalogPromotion;
  discount: number;
};

export type CatalogMarketplaceChannel =
  | "facebook"
  | "instagram"
  | "google_shopping"
  | "tiktok_shop";

export type CatalogMarketplaceFeedItem = {
  channel: CatalogMarketplaceChannel;
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: number;
  availability: string;
};

export type CatalogReadinessItem = {
  label: string;
  ready: boolean;
};

export type CatalogProductDetail =
  CatalogProductSummary & {
    product: CatalogProduct;
    publication: ProductPublication;
    variants: ProductVariant[];
    images: ProductImage[];
    attributes: ProductAttribute[];
    seo: CatalogProductSeo;
  };

export type CatalogContextValue = {
  organizationId: string;
};
