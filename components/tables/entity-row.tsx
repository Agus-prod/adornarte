import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function EntityRow({
  children,
}: Props) {
  return (
    <tr className="border-b transition hover:bg-pink-50">
      {children}
    </tr>
  );
}