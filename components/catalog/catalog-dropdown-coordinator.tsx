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
    };
  }, []);

  return null;
}
