"use client";

import { useEffect } from "react";

function openCartMenu() {
  const menus =
    document.querySelectorAll<HTMLDetailsElement>(
      "[data-catalog-menu]"
    );
  const cartMenus =
    document.querySelectorAll<HTMLDetailsElement>(
      "[data-catalog-cart-menu]"
    );

  menus.forEach((menu) => {
    if (!menu.hasAttribute("data-catalog-cart-menu")) {
      menu.open = false;
    }
  });

  cartMenus.forEach((menu) => {
    menu.open = true;
  });
}

function setCartStatus(message: string) {
  const statusElements =
    document.querySelectorAll<HTMLElement>(
      "[data-cart-live-status]"
    );

  statusElements.forEach((element) => {
    element.hidden = false;
    element.textContent = message;
  });
}

function clearCartStatus() {
  const statusElements =
    document.querySelectorAll<HTMLElement>(
      "[data-cart-live-status]"
    );

  statusElements.forEach((element) => {
    element.hidden = true;
    element.textContent = "";
  });
}

export function CatalogCartMenuController() {
  useEffect(() => {
    function handleAddStart(event: Event) {
      const detail =
        event instanceof CustomEvent
          ? (event.detail as {
              productName?: string;
            })
          : {};

      openCartMenu();
      setCartStatus(
        detail.productName
          ? `Agregando ${detail.productName}...`
          : "Agregando producto..."
      );
    }

    function handleAddDone(event: Event) {
      const detail =
        event instanceof CustomEvent
          ? (event.detail as {
              productName?: string;
            })
          : {};

      openCartMenu();
      setCartStatus(
        detail.productName
          ? `${detail.productName} agregado al carrito.`
          : "Producto agregado al carrito."
      );

      window.setTimeout(() => {
        clearCartStatus();
      }, 1800);
    }

    window.addEventListener(
      "catalog-cart:add-start",
      handleAddStart
    );
    window.addEventListener(
      "catalog-cart:add-done",
      handleAddDone
    );

    return () => {
      window.removeEventListener(
        "catalog-cart:add-start",
        handleAddStart
      );
      window.removeEventListener(
        "catalog-cart:add-done",
        handleAddDone
      );
    };
  }, []);

  return null;
}
