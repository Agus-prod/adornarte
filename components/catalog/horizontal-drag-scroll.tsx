"use client";

import {
  useRef,
  type ReactNode,
  type PointerEvent,
  type MouseEvent,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function HorizontalDragScroll({
  children,
  className,
  ariaLabel,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>
  ) {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    isDraggingRef.current = true;
    didDragRef.current = false;
    startXRef.current = event.clientX;
    scrollLeftRef.current =
      container.scrollLeft;
    container.setPointerCapture(
      event.pointerId
    );
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    const container =
      containerRef.current;

    if (
      !container ||
      !isDraggingRef.current
    ) {
      return;
    }

    const deltaX =
      event.clientX - startXRef.current;

    if (Math.abs(deltaX) > 4) {
      didDragRef.current = true;
    }

    container.scrollLeft =
      scrollLeftRef.current - deltaX;
  }

  function handlePointerEnd(
    event: PointerEvent<HTMLDivElement>
  ) {
    const container =
      containerRef.current;

    isDraggingRef.current = false;

    if (
      container?.hasPointerCapture(
        event.pointerId
      )
    ) {
      container.releasePointerCapture(
        event.pointerId
      );
    }
  }

  function handleClickCapture(
    event: MouseEvent<HTMLDivElement>
  ) {
    if (!didDragRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  }

  return (
    <div
      ref={containerRef}
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
    >
      {children}
    </div>
  );
}
