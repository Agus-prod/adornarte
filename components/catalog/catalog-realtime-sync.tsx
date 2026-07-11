"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Props = {
  cartId: string | null;
};

export function CatalogRealtimeSync({
  cartId,
}: Props) {
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

    let channel = supabase
      .channel(
        cartId
          ? `catalog-sync-${cartId}`
          : "catalog-sync-public"
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
          table: "product_publications",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_images",
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
      );

    if (cartId) {
      channel = channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "catalog_cart_realtime_events",
          filter: `cart_id=eq.${cartId}`,
        },
        scheduleRefresh
      );
    }

    const subscription =
      channel.subscribe();

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

      void supabase.removeChannel(
        subscription
      );
    };
  }, [cartId, router]);

  return null;
}
