import { PublicationForm } from "@/components/products/forms/publication-form";
import { updateProductPublication } from "@/app/(dashboard)/inventario/productos/publication-actions";
import { getProductPublicationForEditor } from "@/lib/catalog/services/publication-service";

type Props = {
  productId: string;
};

function getStatusLabel(status: string) {
  if (status === "published") {
    return "Publicado";
  }

  if (status === "hidden") {
    return "Oculto";
  }

  if (status === "scheduled") {
    return "Programado";
  }

  return "Borrador";
}

export async function ProductPublicationCard({
  productId,
}: Props) {
  const publication =
    await getProductPublicationForEditor(
      productId
    );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Publicación
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Administra visibilidad, destacado, slug y SEO del catálogo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {getStatusLabel(publication.status)}
          </span>

          {publication.is_visible && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Visible
            </span>
          )}

          {publication.is_featured && (
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
              Destacado
            </span>
          )}
        </div>
      </div>

      <PublicationForm
        publication={publication}
        action={updateProductPublication.bind(
          null,
          productId
        )}
      />
    </div>
  );
}
