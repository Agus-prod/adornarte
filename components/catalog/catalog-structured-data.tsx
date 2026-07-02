type Props = {
  data: Record<string, unknown>;
};

export function CatalogStructuredData({
  data,
}: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
