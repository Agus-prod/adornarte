import { ProductAttributesCard } from "./cards/product-attributes-card";
import { ProductImagesCard } from "./cards/product-images-card";
import { ProductInfoCard } from "./cards/product-info-card";
import { ProductPublicationCard } from "./cards/product-publication-card";
import { ProductVariantsCard } from "./cards/product-variants-card";
import { ProductEditorShell } from "./product-editor-shell";

type Props = {
  productId: string;
};

export function ProductEditor({
  productId,
}: Props) {
  return (
    <ProductEditorShell
      info={
        <ProductInfoCard
          productId={productId}
        />
      }
      variants={
        <ProductVariantsCard
          productId={productId}
        />
      }
      images={
        <ProductImagesCard
          productId={productId}
        />
      }
      attributes={
        <ProductAttributesCard
          productId={productId}
        />
      }
      publication={
        <ProductPublicationCard
          productId={productId}
        />
      }
    />
  );
}
