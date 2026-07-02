import type { ProductPublication } from "@/lib/catalog/repositories/publication-repository";

type Props = {
  publication: ProductPublication;
  action: (formData: FormData) => Promise<void>;
};

export function PublicationForm({
  publication,
  action,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Estado
          </label>

          <select
            name="status"
            defaultValue={publication.status}
            className="w-full rounded-xl border p-3"
          >
            <option value="draft">
              Borrador
            </option>

            <option value="published">
              Publicado
            </option>

            <option value="hidden">
              Oculto
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Slug
          </label>

          <input
            name="slug"
            required
            defaultValue={publication.slug}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_visible"
            defaultChecked={publication.is_visible}
            className="h-4 w-4"
          />

          Visible
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={publication.is_featured}
            className="h-4 w-4"
          />

          Destacado
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Meta title
          </label>

          <input
            name="meta_title"
            defaultValue={publication.meta_title ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Canonical
          </label>

          <input
            name="canonical_url"
            defaultValue={publication.canonical_url ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Meta description
        </label>

        <textarea
          name="meta_description"
          rows={3}
          defaultValue={publication.meta_description ?? ""}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Open Graph title
          </label>

          <input
            name="open_graph_title"
            defaultValue={publication.open_graph_title ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Open Graph image URL
          </label>

          <input
            name="open_graph_image_url"
            defaultValue={publication.open_graph_image_url ?? ""}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Open Graph description
        </label>

        <textarea
          name="open_graph_description"
          rows={3}
          defaultValue={publication.open_graph_description ?? ""}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
      >
        Guardar publicación
      </button>
    </form>
  );
}
