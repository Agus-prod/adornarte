"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { ProductTabs } from "./tabs/product-tabs";

type Tab =
  | "info"
  | "variants"
  | "images"
  | "attributes"
  | "publication";

type Props = {
  info: ReactNode;
  variants: ReactNode;
  images: ReactNode;
  attributes: ReactNode;
  publication: ReactNode;
};

export function ProductEditorShell({
  info,
  variants,
  images,
  attributes,
  publication,
}: Props) {
  const [tab, setTab] =
    useState<Tab>("info");

  return (
    <div className="space-y-6">
      <ProductTabs
        value={tab}
        onChange={setTab}
      />

      {tab === "info" && info}

      {tab === "variants" && variants}

      {tab === "images" && images}

      {tab === "attributes" && attributes}

      {tab === "publication" && publication}
    </div>
  );
}
