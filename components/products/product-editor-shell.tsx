"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

import { ProductTabs } from "./tabs/product-tabs";
import {
  isProductEditorTab,
  type ProductEditorTab,
} from "./tabs/product-editor-tabs";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const [tab, setTab] =
    useState<ProductEditorTab>(() => {
      const value =
        searchParams.get("tab");

      if (isProductEditorTab(value)) {
        return value;
      }

      return "info";
    });

  function handleTabChange(
    nextTab: ProductEditorTab
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (nextTab === "info") {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }

    const query = params.toString();

    setTab(nextTab);

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    );
  }

  return (
    <div className="space-y-6">
      <ProductTabs
        value={tab}
        onChange={handleTabChange}
      />

      {tab === "info" && info}

      {tab === "variants" && variants}

      {tab === "images" && images}

      {tab === "attributes" && attributes}

      {tab === "publication" && publication}
    </div>
  );
}
