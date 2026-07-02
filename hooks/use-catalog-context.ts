"use client";

import { useContext } from "react";
import { CatalogContext } from "@/providers/catalog-provider";

export function useCatalogContext() {
  const context =
    useContext(CatalogContext);

  if (!context) {
    throw new Error(
      "useCatalogContext debe usarse dentro de CatalogProvider."
    );
  }

  return context;
}
