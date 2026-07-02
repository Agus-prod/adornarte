"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { ReactNode } from "react";

import { ProductTabs } from "./tabs/product-tabs";
import type { ProductEditorTab } from "./tabs/product-editor-tabs";

type Props = {
  activeTab: ProductEditorTab;
  children: ReactNode;
};

export function ProductEditorShell({
  activeTab,
  children,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

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
        value={activeTab}
        onChange={handleTabChange}
      />

      {children}
    </div>
  );
}
