import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  columns?: 1 | 2 | 3 | 4;
  children: ReactNode;
};

export function FormGrid({
  columns = 2,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        "grid gap-5",
        {
          "md:grid-cols-1": columns === 1,
          "md:grid-cols-2": columns === 2,
          "md:grid-cols-3": columns === 3,
          "md:grid-cols-4": columns === 4,
        }
      )}
    >
      {children}
    </div>
  );
}