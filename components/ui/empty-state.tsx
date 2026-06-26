import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="rounded-2xl border border-dashed bg-white p-12 text-center">

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-gray-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}