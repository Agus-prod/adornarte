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

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      void supabase.removeChannel(
        subscription
      );
    };
  }, [cartId, router]);

  return null;
}
