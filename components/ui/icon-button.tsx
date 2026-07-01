"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function IconButton({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-gray-200
        bg-white
        text-gray-700
        transition-all
        hover:bg-gray-100
        active:scale-95
        disabled:pointer-events-none
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}