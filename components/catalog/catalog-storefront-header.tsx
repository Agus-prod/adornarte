import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { CatalogDropdownCoordinator } from "@/components/catalog/catalog-dropdown-coordinator";
import { MarketplaceCartPanel } from "@/components/catalog/marketplace-cart-panel";
import { CustomerAccessMenu } from "@/components/catalog/customer-access-menu";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";
import type { CatalogCartDetail } from "@/lib/catalog/types";

type Props = {
  cart: CatalogCartDetail | null;
  customer: CatalogCustomer | null;
  showBack?: boolean;
};
function CartMenu({
  cart,
}: {
  cart: CatalogCartDetail | null;
}) {
  const count =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <details
      className="group relative"
      data-catalog-menu
    >
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-white px-4 py-2 text-pink-700 shadow-sm">
        <ShoppingBag className="size-4" />
        <span className="hidden sm:inline">
          Carrito
        </span>
        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-bold">
          {count}
        </span>
      </summary>
      <div
        data-dropdown-panel
        className="fixed inset-x-3 top-16 z-30 max-w-none sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)]"
      >
        <MarketplaceCartPanel
          cart={cart}
          variant="dropdown"
        />
      </div>
    </details>
  );
}

export function CatalogStorefrontHeader({
  cart,
  customer,
  showBack = false,
}: Props) {
  return (
    <div className="sticky top-0 z-50 border-b border-pink-100/70 bg-white/80 backdrop-blur-xl">
      <CatalogDropdownCoordinator />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {showBack && (
            <Link
              href="/catalogo"
              className="flex size-10 items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm hover:text-pink-700"
            >
              <ArrowLeft className="size-4" />
            </Link>
          )}
          <Link
            href="/catalogo"
            className="min-w-0 truncate text-base font-black tracking-tight sm:text-lg"
          >
            AdornArte Shop
          </Link>
        </div>
        <nav className="flex shrink-0 items-center gap-1 text-sm font-semibold sm:gap-2">
          <CustomerAccessMenu
            customer={customer}
          />
          <CartMenu cart={cart} />
        </nav>
      </div>
    </div>
  );
}
