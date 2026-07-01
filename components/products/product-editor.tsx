"use client";

import { useState } from "react";

import { ProductTabs } from "./tabs/product-tabs";

import { ProductInfoCard } from "./cards/product-info-card";

import { ProductVariantsCard } from "./cards/product-variants-card";

import { ProductImagesCard } from "./cards/product-images-card";

import { ProductAttributesCard } from "./cards/product-attributes-card";

import { ProductPublicationCard } from "./cards/product-publication-card";

type Props = {
  productId: string;
};

export function ProductEditor({
  productId,
}: Props) {
  const [tab, setTab] = useState<
    "info" |
    "variants" |
    "images" |
    "attributes" |
    "publication"
  >("info");

  return (
    <div className="space-y-6">

      <ProductTabs
        value={tab}
        onChange={setTab}
      />

      {tab === "info" && (
        <ProductInfoCard
          productId={productId}
        />
      )}

      {tab === "variants" && (
        <ProductVariantsCard
          productId={productId}
        />
      )}

      {tab === "images" && (
        <ProductImagesCard
          productId={productId}
        />
      )}

      {tab === "attributes" && (
        <ProductAttributesCard
          productId={productId}
        />
      )}

      {tab === "publication" && (
        <ProductPublicationCard
          productId={productId}
        />
      )}

    </div>
  );
}