"use client";

import { useEffect } from "react";

export function CatalogDropdownCoordinator() {
  useEffect(() => {
    const selector =
      "details[data-catalog-menu]";

    function closeOthers(
      current: HTMLDetailsElement
    ) {
      const menus =
        document.querySelectorAll<HTMLDetailsElement>(
          selector
        );

      for (const menu of menus) {
        if (menu !== current) {
          menu.open = false;
        }
      }
    }

    function handleToggle(event: Event) {
      const target =
        event.currentTarget;

      if (
        target instanceof HTMLDetailsElement &&
        target.open
      ) {
        closeOthers(target);
      }
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const menus =
        document.querySelectorAll<HTMLDetailsElement>(
          selector
        );

      for (const menu of menus) {
        if (!menu.contains(target)) {
          menu.open = false;
        }
      }
    }

    function openCartMenu() {
      const cartMenu =
        document.querySelector<HTMLDetailsElement>(
          "[data-catalog-cart-menu]"
        );

      if (!cartMenu) {
        return;
      }

      closeOthers(cartMenu);
      cartMenu.open = true;
    }

    function updateCartBadges(
      quantity: number
    ) {
      const badges =
        document.querySelectorAll<HTMLElement>(
          "[data-cart-count-badge]"
        );

      for (const badge of badges) {
        const current = Number(
          badge.textContent ?? "0"
        );
        const next =
          Number.isFinite(current)
            ? current + quantity
            : quantity;

        badge.textContent =
          String(Math.max(0, next));
      }
    }

    function setCartBadges(
      quantity: number
    ) {
      const badges =
        document.querySelectorAll<HTMLElement>(
          "[data-cart-count-badge]"
        );

      for (const badge of badges) {
        badge.textContent =
          String(Math.max(0, quantity));
      }
    }

    function handleCartAddStart() {
      openCartMenu();
    }

    function handleOptimisticAdd(
      event: Event
    ) {
      const quantity =
        event instanceof CustomEvent
          ? Number(
              event.detail?.quantity ?? 1
            )
          : 1;

      updateCartBadges(
        Number.isFinite(quantity) &&
          quantity > 0
          ? quantity
          : 1
      );
    }

    function handleOptimisticRemove(
      event: Event
    ) {
      const quantity =
        event instanceof CustomEvent
          ? Number(
              event.detail?.quantity ?? 1
            )
          : 1;

      updateCartBadges(
        Number.isFinite(quantity) &&
          quantity > 0
          ? -quantity
          : -1
      );
    }

    function handleOptimisticClear() {
      setCartBadges(0);
    }

    const menus =
      document.querySelectorAll<HTMLDetailsElement>(
        selector
      );

    for (const menu of menus) {
      menu.addEventListener(
        "toggle",
        handleToggle
      );
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );
    window.addEventListener(
      "catalog-cart:add-start",
      handleCartAddStart
    );
    window.addEventListener(
      "catalog-cart:optimistic-add",
      handleOptimisticAdd
    );
    window.addEventListener(
      "catalog-cart:optimistic-remove",
      handleOptimisticRemove
    );
    window.addEventListener(
      "catalog-cart:optimistic-clear",
      handleOptimisticClear
    );

    return () => {
      for (const menu of menus) {
        menu.removeEventListener(
          "toggle",
          handleToggle
        );
      }

      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      window.removeEventListener(
        "catalog-cart:add-start",
        handleCartAddStart
      );
      window.removeEventListener(
        "catalog-cart:optimistic-add",
        handleOptimisticAdd
      );
      window.removeEventListener(
        "catalog-cart:optimistic-remove",
        handleOptimisticRemove
      );
      window.removeEventListener(
        "catalog-cart:optimistic-clear",
        handleOptimisticClear
      );
    };
  }, []);

  return null;
}
