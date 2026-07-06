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
    if (!cartId) {
      return;
    }

    const supabase = createClient();

    function scheduleRefresh() {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(() => {
        router.refresh();
      }, 250);
    }

    const channel = supabase
      .channel(`catalog-cart-${cartId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "catalog_carts",
          filter: `id=eq.${cartId}`,
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "catalog_cart_items",
          filter: `cart_id=eq.${cartId}`,
        },
        scheduleRefresh
      )
      .subscribe();

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      void supabase.removeChannel(channel);
    };
  }, [cartId, router]);

  return null;
}
