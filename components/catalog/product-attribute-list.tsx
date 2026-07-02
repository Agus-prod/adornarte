import type { ProductAttribute } from "@/lib/catalog/repositories/attribute-repository";

type Props = {
  attributes: ProductAttribute[];
};

export function ProductAttributeList({
  attributes,
}: Props) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        Atributos
      </h2>

      <dl className="grid gap-3 sm:grid-cols-2">
        {attributes.map((attribute) => (
          <div
            key={attribute.id}
            className="rounded-lg border p-3"
          >
            <dt className="text-sm text-gray-500">
              {attribute.name}
            </dt>
            <dd className="mt-1 font-medium">
              {attribute.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
