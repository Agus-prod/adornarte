type Props = {
  title: string;
  children: React.ReactNode;
};

export function FormSection({
  title,
  children,
}: Props) {
  return (
    <section className="space-y-5">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      {children}
    </section>
  );
}