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

export function CatalogCartMenuController() {
  useEffect(() => {
    function handleAddStart() {
      openCartMenu();
    }

    function handleAddDone() {
      openCartMenu();
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
