import { ProductAttributesCard } from "./cards/product-attributes-card";
import { ProductImagesCard } from "./cards/product-images-card";
import { ProductInfoCard } from "./cards/product-info-card";
import { ProductPublicationCard } from "./cards/product-publication-card";
import { ProductVariantsCard } from "./cards/product-variants-card";
import { ProductEditorShell } from "./product-editor-shell";
import {
  isProductEditorTab,
  type ProductEditorTab,
} from "./tabs/product-editor-tabs";

type Props = {
  productId: string;
  tab?: string;
};

export function ProductEditor({
  productId,
  tab,
}: Props) {
  const requestedTab = tab ?? null;
  const activeTab: ProductEditorTab =
    isProductEditorTab(requestedTab)
      ? requestedTab
      : "info";

  let content;

  if (activeTab === "variants") {
    content = (
      <ProductVariantsCard
        productId={productId}
      />
    );
  } else if (activeTab === "images") {
    content = (
      <ProductImagesCard
        productId={productId}
      />
    );
  } else if (activeTab === "attributes") {
    content = (
      <ProductAttributesCard
        productId={productId}
      />
    );
  } else if (activeTab === "publication") {
    content = (
      <ProductPublicationCard
        productId={productId}
      />
    );
  } else {
    content = (
      <ProductInfoCard
        productId={productId}
      />
    );
  }

  return (
    <ProductEditorShell
      activeTab={activeTab}
    >
      {content}
    </ProductEditorShell>
  );
}
