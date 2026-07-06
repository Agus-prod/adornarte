import {
  createCatalogBrandAction,
  deleteCatalogBrandAction,
  updateCatalogBrandAction,
} from "@/app/(dashboard)/catalogo/marcas/actions";
import { listCatalogBrands } from "@/lib/catalog/services/brand-service";

export default async function CatalogBrandsPage() {
  const brands =
    await listCatalogBrands();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink-500">
          Commerce
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Marcas
        </h1>
        <p className="mt-2 max-w-3xl text-gray-500">
          Administra las marcas visibles en el catalogo. El logo se muestra como acceso rapido para el cliente.
        </p>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="text-xl font-bold">
          Nueva marca
        </h2>
        <form
          action={createCatalogBrandAction}
          className="mt-5 grid gap-4 lg:grid-cols-2"
        >
          <label className="space-y-2">
            <span className="text-sm font-semibold">
              Nombre
            </span>
            <input
              name="name"
              required
              className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">
              Slug
            </span>
            <input
              name="slug"
              placeholder="se genera desde el nombre"
              className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold">
              URL del logotipo
            </span>
            <input
              name="logo_url"
              type="url"
              placeholder="https://..."
              className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold">
              Descripcion
            </span>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">
              Orden
            </span>
            <input
              name="sort_order"
              type="number"
              defaultValue={0}
              className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
            />
          </label>

          <label className="flex items-center gap-2 self-end text-sm font-semibold">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked
            />
            Visible en catalogo
          </label>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="min-h-11 rounded-2xl bg-pink-600 px-6 text-sm font-bold text-white hover:bg-pink-700"
            >
              Crear marca
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        {brands.map((brand) => (
          <article
            key={brand.id}
            className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <div className="flex min-h-28 w-full items-center justify-center rounded-3xl border border-pink-100 bg-pink-50/50 p-4 lg:w-40">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="max-h-20 max-w-32 object-contain"
                  />
                ) : (
                  <span className="flex size-16 items-center justify-center rounded-full bg-white text-xl font-black text-pink-600 shadow-sm">
                    {brand.name
                      .trim()
                      .charAt(0)
                      .toUpperCase() || "M"}
                  </span>
                )}
              </div>

              <form
                action={updateCatalogBrandAction.bind(
                  null,
                  brand.id
                )}
                className="grid flex-1 gap-4 lg:grid-cols-2"
              >
                <label className="space-y-2">
                  <span className="text-sm font-semibold">
                    Nombre
                  </span>
                  <input
                    name="name"
                    required
                    defaultValue={brand.name}
                    className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">
                    Slug
                  </span>
                  <input
                    name="slug"
                    defaultValue={brand.slug}
                    className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
                  />
                </label>

                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-semibold">
                    URL del logotipo
                  </span>
                  <input
                    name="logo_url"
                    type="url"
                    defaultValue={brand.logo_url ?? ""}
                    className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
                  />
                </label>

                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-semibold">
                    Descripcion
                  </span>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={brand.description ?? ""}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">
                    Orden
                  </span>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={brand.sort_order}
                    className="min-h-11 w-full rounded-2xl border border-zinc-200 px-4"
                  />
                </label>

                <label className="flex items-center gap-2 self-end text-sm font-semibold">
                  <input
                    name="is_active"
                    type="checkbox"
                    defaultChecked={brand.is_active}
                  />
                  Visible en catalogo
                </label>

                <div className="flex flex-wrap gap-3 lg:col-span-2">
                  <button
                    type="submit"
                    className="min-h-11 rounded-2xl bg-pink-600 px-5 text-sm font-bold text-white hover:bg-pink-700"
                  >
                    Guardar marca
                  </button>
                </div>
              </form>

              <form
                action={deleteCatalogBrandAction.bind(
                  null,
                  brand.id
                )}
              >
                <button
                  type="submit"
                  className="min-h-11 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
