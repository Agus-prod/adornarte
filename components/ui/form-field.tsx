import { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  required?: boolean;
};

export function FormField({
  label,
  children,
  required,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}