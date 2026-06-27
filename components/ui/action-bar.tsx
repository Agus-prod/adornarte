import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ActionBar({
  children,
}: Props) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-end
        gap-3
      "
    >
      {children}
    </div>
  );
}