type Props = {
  children: React.ReactNode;
};

export function FormActions({
  children,
}: Props) {
  return (
    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
      {children}
    </div>
  );
}