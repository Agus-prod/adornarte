import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function EntityCell({
  children,
  className = "",
}: Props) {
  return (
    <td className={`px-4 py-3 ${className}`}>
      {children}
    </td>
  );
}