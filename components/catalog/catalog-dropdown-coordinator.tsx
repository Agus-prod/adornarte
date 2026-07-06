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
    };
  }, []);

  return null;
}
