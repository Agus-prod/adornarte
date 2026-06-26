
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function IconButton({
    
  children,
  className = "",
  ...props
} 
: Props) {
 return (
  <button
    {...props}
    style={{
      width: 80,
      height: 80,
      background: "lime",
      color: "black",
      fontSize: 30,
      border: "5px solid blue",
    }}
  >
    BOTON
  </button>
  );
}