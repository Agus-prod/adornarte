"use client";

import {
  createContext,
  useMemo,
} from "react";
import type {
  CatalogContextValue,
} from "@/lib/catalog/types";

export const CatalogContext =
  createContext<CatalogContextValue | null>(
    null
  );

type Props = {
  organizationId: string;
  children: React.ReactNode;
};

export function CatalogProvider({
  organizationId,
  children,
}: Props) {
  const value =
    useMemo<CatalogContextValue>(
      () => ({
        organizationId,
      }),
      [organizationId]
    );

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}
