"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "danger"
  | "ghost";

type Size =
  | "sm"
  | "md"
  | "lg";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
  };

const variants: Record<Variant, string> = {
  default:
    "bg-pink-500 text-white hover:bg-pink-600",

  primary:
    "bg-pink-500 text-white hover:bg-pink-600",

  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200",

  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",

  destructive:
    "bg-red-600 text-white hover:bg-red-700",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizes = {
  sm: "h-9 px-3 text-sm",

  md: "h-11 px-5",

  lg: "h-12 px-6 text-base",
};

export function Button({
  children,
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        transition-all
        duration-200
        font-medium
        disabled:opacity-50
        disabled:pointer-events-none
        focus:outline-none
        focus:ring-2
        focus:ring-pink-400
        active:scale-95

        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}