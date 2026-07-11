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

    function showCartStatus(
      productName: string,
      done = false
    ) {
      const cartMenu =
        document.querySelector<HTMLDetailsElement>(
          "[data-catalog-cart-menu]"
        );

      if (!cartMenu) {
        return;
      }

      closeOthers(cartMenu);
      cartMenu.open = true;

      const status =
        cartMenu.querySelector<HTMLElement>(
          "[data-cart-live-status]"
        );

      if (!status) {
        return;
      }

      status.hidden = false;
      status.textContent = done
        ? "Carrito actualizado."
        : `Agregando ${productName} al carrito...`;

      if (done) {
        window.setTimeout(() => {
          status.hidden = true;
          status.textContent = "";
        }, 1800);
      }
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
          String(next);
      }
    }

    function handleCartAddStart(
      event: Event
    ) {
      const productName =
        event instanceof CustomEvent
          ? String(
              event.detail?.productName ??
                "producto"
            )
          : "producto";

      showCartStatus(productName);
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

    function handleCartAddDone(
      event: Event
    ) {
      const productName =
        event instanceof CustomEvent
          ? String(
              event.detail?.productName ??
                "producto"
            )
          : "producto";

      showCartStatus(productName, true);
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
      "catalog-cart:add-done",
      handleCartAddDone
    );
    window.addEventListener(
      "catalog-cart:optimistic-add",
      handleOptimisticAdd
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
        "catalog-cart:add-done",
        handleCartAddDone
      );
      window.removeEventListener(
        "catalog-cart:optimistic-add",
        handleOptimisticAdd
      );
    };
  }, []);

  return null;
}
