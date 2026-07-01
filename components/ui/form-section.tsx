import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      <header className="border-b px-6 py-5">

        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

      </header>

      <div className="space-y-6 p-6">
        {children}
      </div>

    </section>
  );
}