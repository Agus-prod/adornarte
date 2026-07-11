"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function AppRealtimeSync() {
  const router = useRouter();
  const refreshTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const fallbackTimer = useRef<
    ReturnType<typeof setInterval> | null
  >(null);

  useEffect(() => {
    const supabase = createClient();

    function scheduleRefresh() {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(() => {
        router.refresh();
      }, 250);
    }

    function scheduleVisibleRefresh() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        scheduleRefresh();
      }
    }

    const channel = supabase
      .channel("adornarte-internal-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "catalog_orders",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "catalog_payments",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customers",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_variants",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stock_movements",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sale_items",
        },
        scheduleRefresh
      )
      .subscribe();

    fallbackTimer.current =
      setInterval(
        scheduleVisibleRefresh,
        5000
      );

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      if (fallbackTimer.current) {
        clearInterval(
          fallbackTimer.current
        );
      }

      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
