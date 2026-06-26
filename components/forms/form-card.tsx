type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export function FormCard({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {(title || description) && (
        <div className="border-b px-6 py-5">
          {title && (
            <h2 className="text-xl font-semibold">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}