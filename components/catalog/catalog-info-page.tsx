import { CatalogStorefrontHeader } from "@/components/catalog/catalog-storefront-header";
import type { CatalogCustomer } from "@/lib/catalog/repositories/customer-repository";
import type { CatalogCartDetail } from "@/lib/catalog/types";

type Section = {
  title: string;
  body: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Section[];
  cart: CatalogCartDetail | null;
  customer: CatalogCustomer | null;
  variant?: "cards" | "faq";
};

export function CatalogInfoPage({
  eyebrow,
  title,
  description,
  sections,
  cart,
  customer,
  variant = "cards",
}: Props) {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <CatalogStorefrontHeader
        cart={cart}
        customer={customer}
        showBack
      />

      <section className="border-b border-pink-100 bg-[radial-gradient(circle_at_20%_10%,#fce7f3,transparent_30%),radial-gradient(circle_at_90%_20%,#ede9fe,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7fb_45%,#f8f5ff_100%)]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase text-pink-600">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
            {description}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-8">
        {variant === "faq"
          ? sections.map((section) => (
              <details
                key={section.title}
                className="group rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50 transition-all open:border-pink-200 open:bg-pink-50/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  <span>{section.title}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-pink-50 text-pink-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-7 text-zinc-600">
                  {section.body}
                </p>
              </details>
            ))
          : sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50"
              >
                <h2 className="text-lg font-bold">
                  {section.title}
                </h2>
                <p className="mt-2 leading-7 text-zinc-600">
                  {section.body}
                </p>
              </section>
            ))}
      </div>
    </main>
  );
}
