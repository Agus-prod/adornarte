"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
};

export function SidebarLink({
  href,
  children,
  icon,
}: Props) {
  const pathname =
    usePathname();

  const isActive =
    pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3
        rounded-xl px-4 py-3
        transition-all

        ${
          isActive
            ? "bg-pink-100 text-pink-600 font-medium"
            : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
        }
      `}
    >
      {icon}
      {children}
    </Link>
  );
}