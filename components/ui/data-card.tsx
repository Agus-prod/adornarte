import { ReactNode } from "react";

type DataCardProps = {
  children: ReactNode;
};

export function DataCard({
  children,
}: DataCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {children}
    </div>
  );
}