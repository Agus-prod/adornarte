"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Barcode,
  ImagePlus,
  PackagePlus,
  Plus,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";
import { BarcodeScannerDialog } from "@/components/barcode/barcode-scanner-dialog";
import type { Tables } from "@/lib/database.types";

type Category = Tables<"categories">;
type Brand = Tables<"brands">;

type Props = {
  categories: Category[];
  brands: Brand[];
  action: (formData: FormData) => Promise<void>;
};

type ScannerTarget =
  | {
      type: "product";
    }
  | {
      type: "variant";
      id: string;
    };

const attributeTypes = [
  {
    value: "color",
    label: "Color",
  },
  {
    value: "tone",
    label: "Tono",
  },
  {
    value: "finish",
    label: "Acabado",
  },
  {
    value: "coverage",
    label: "Cobertura",
  },
  {
    value: "spf",
    label: "SPF",
  },
  {
    value: "custom",
    label: "Otro",
  },
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function FieldLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-zinc-800">
      {children}
    </label>
  );
}

type SectionHeaderProps = {
  icon: typeof Plus;
  title: string;
  description: string;
  buttonLabel?: string;
  onAdd?: () => void;
};

function SectionHeader({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onAdd,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
          <Icon
            className="size-5"
            aria-hidden="true"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {buttonLabel && onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-pink-100 px-4 text-sm font-bold text-pink-700 hover:bg-pink-50"
        >
          <Plus
            className="size-4"
            aria-hidden="true"
          />
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
}

export function NewProductCompleteForm({
  categories,
  brands,
  action,
}: Props) {
  const [variants, setVariants] = useState([
    createId("variant"),
  ]);
  const [images, setImages] = useState([
    createId("image"),
  ]);
  const [attributes, setAttributes] =
    useState([createId("attribute")]);
  const [mainBarcode, setMainBarcode] =
    useState("");
  const [
    variantBarcodes,
    setVariantBarcodes,
  ] = useState<Record<string, string>>({});
  const [
    scannerTarget,
    setScannerTarget,
  ] = useState<ScannerTarget | null>(null);

  function applyScannedCode(code: string) {
    const cleanCode = code.trim();

    if (!scannerTarget || !cleanCode) {
      return;
    }

    if (scannerTarget.type === "product") {
      setMainBarcode(cleanCode);
      return;
    }

    setVariantBarcodes((current) => ({
      ...current,
      [scannerTarget.id]: cleanCode,
    }));
  }

  return (
    <form
      action={action}
      className="space-y-6"
    >
      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <PackagePlus
              className="size-5"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Informacion principal
            </h2>
            <p className="text-sm text-zinc-500">
              Datos base para inventario, POS y catalogo.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <FieldLabel>Nombre</FieldLabel>
            <input
              name="name"
              required
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>SKU</FieldLabel>
              <input
                name="sku"
                className="w-full rounded-xl border p-3"
              />
            </div>
            <div>
              <FieldLabel>Codigo de barras</FieldLabel>
              <div className="flex gap-2">
                <input
                  name="barcode"
                  value={mainBarcode}
                  onChange={(event) =>
                    setMainBarcode(
                      event.target.value
                    )
                  }
                  className="min-w-0 flex-1 rounded-xl border p-3"
                />
                <button
                  type="button"
                  onClick={() =>
                    setScannerTarget({
                      type: "product",
                    })
                  }
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white"
                >
                  <Barcode className="size-4" />
                  Escanear
                </button>
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>Descripcion</FieldLabel>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Categoria</FieldLabel>
              <select
                name="category_id"
                className="w-full rounded-xl border p-3"
              >
                <option value="">Seleccionar</option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Marca</FieldLabel>
              <select
                name="brand_id"
                className="w-full rounded-xl border p-3"
              >
                <option value="">Seleccionar</option>
                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="number"
              step="0.01"
              name="cost_price"
              placeholder="Costo"
              className="rounded-xl border p-3"
            />
            <input
              type="number"
              step="0.01"
              name="sale_price"
              placeholder="Precio venta"
              className="rounded-xl border p-3"
            />
            <input
              type="number"
              step="0.01"
              name="offer_price"
              placeholder="Precio oferta"
              className="rounded-xl border p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              name="stock"
              placeholder="Stock inicial"
              className="rounded-xl border p-3"
            />
            <input
              type="number"
              name="min_stock"
              placeholder="Stock minimo"
              className="rounded-xl border p-3"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Tags}
          title="Variantes iniciales"
          description="Agrega tonos, colores o presentaciones con stock propio."
          buttonLabel="Agregar variante"
          onAdd={() =>
            setVariants((current) => [
              ...current,
              createId("variant"),
            ])
          }
        />

        <div className="mt-5 space-y-4">
          {variants.map((id, index) => (
            <div
              key={id}
              className="rounded-2xl border bg-zinc-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="default_variant_index"
                    value={index}
                    defaultChecked={index === 0}
                  />
                  Variante predeterminada
                </label>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setVariants((current) =>
                        current.filter(
                          (item) => item !== id
                        )
                      )
                    }
                    className="rounded-xl p-2 text-zinc-500 hover:bg-white hover:text-pink-600"
                    aria-label="Eliminar variante"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <input
                  name="variant_name"
                  placeholder="Nombre variante"
                  className="rounded-xl border bg-white p-3"
                />
                <input
                  name="variant_sku"
                  placeholder="SKU variante"
                  className="rounded-xl border bg-white p-3"
                />
                <input
                  name="variant_barcode"
                  value={
                    variantBarcodes[id] ?? ""
                  }
                  onChange={(event) =>
                    setVariantBarcodes(
                      (current) => ({
                        ...current,
                        [id]: event.target.value,
                      })
                    )
                  }
                  placeholder="Codigo de barras"
                  className="rounded-xl border bg-white p-3"
                />
                <button
                  type="button"
                  onClick={() =>
                    setScannerTarget({
                      type: "variant",
                      id,
                    })
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white"
                >
                  <Barcode className="size-4" />
                  Escanear codigo
                </button>
                <input
                  name="variant_stock"
                  type="number"
                  placeholder="Stock"
                  className="rounded-xl border bg-white p-3"
                />
                <input
                  name="variant_cost_price"
                  type="number"
                  step="0.01"
                  placeholder="Costo"
                  className="rounded-xl border bg-white p-3"
                />
                <input
                  name="variant_sale_price"
                  type="number"
                  step="0.01"
                  placeholder="Precio venta"
                  className="rounded-xl border bg-white p-3"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <SectionHeader
          icon={ImagePlus}
          title="Imagenes iniciales"
          description="Pega URLs para dejar el catalogo listo. La primera sera principal."
          buttonLabel="Agregar imagen"
          onAdd={() =>
            setImages((current) => [
              ...current,
              createId("image"),
            ])
          }
        />

        <div className="mt-5 space-y-3">
          {images.map((id) => (
            <div
              key={id}
              className="grid gap-3 md:grid-cols-[1fr_auto]"
            >
              <input
                name="image_url"
                type="url"
                placeholder="https://..."
                className="rounded-xl border p-3"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setImages((current) =>
                      current.filter(
                        (item) => item !== id
                      )
                    )
                  }
                  className="rounded-xl border px-4 text-zinc-500 hover:text-pink-600"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Sparkles}
          title="Atributos iniciales"
          description="Color, tono, acabado, cobertura o datos utiles para filtros."
          buttonLabel="Agregar atributo"
          onAdd={() =>
            setAttributes((current) => [
              ...current,
              createId("attribute"),
            ])
          }
        />

        <div className="mt-5 space-y-3">
          {attributes.map((id) => (
            <div
              key={id}
              className="grid gap-3 md:grid-cols-[12rem_1fr_1fr_auto]"
            >
              <select
                name="attribute_type"
                className="rounded-xl border p-3"
              >
                {attributeTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
              <input
                name="attribute_name"
                placeholder="Nombre"
                className="rounded-xl border p-3"
              />
              <input
                name="attribute_value"
                placeholder="Valor"
                className="rounded-xl border p-3"
              />
              {attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setAttributes((current) =>
                      current.filter(
                        (item) => item !== id
                      )
                    )
                  }
                  className="rounded-xl border px-4 text-zinc-500 hover:text-pink-600"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <SectionHeader
          icon={Sparkles}
          title="Publicacion"
          description="Deja el producto listo para catalogo o guardalo como borrador."
        />

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <select
            name="publication_status"
            defaultValue="draft"
            className="rounded-xl border p-3"
          >
            <option value="draft">Borrador</option>
            <option value="published">
              Publicado
            </option>
            <option value="hidden">Oculto</option>
            <option value="scheduled">
              Programado
            </option>
          </select>
          <input
            name="publication_slug"
            placeholder="slug-del-producto"
            className="rounded-xl border p-3"
          />
          <input
            name="meta_title"
            placeholder="Titulo para Google"
            className="rounded-xl border p-3"
          />
          <input
            name="published_at"
            type="datetime-local"
            className="rounded-xl border p-3"
          />
          <textarea
            name="meta_description"
            rows={3}
            placeholder="Descripcion corta para buscadores"
            className="rounded-xl border p-3 md:col-span-2"
          />
          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="publication_visible"
              />
              Visible en catalogo
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="publication_featured"
              />
              Destacado
            </label>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-10 rounded-3xl border bg-white/90 p-4 shadow-xl shadow-pink-100 backdrop-blur">
        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl bg-pink-600 px-6 font-bold text-white hover:bg-pink-700 md:w-auto"
        >
          Crear producto completo
        </button>
      </div>

      {scannerTarget && (
        <BarcodeScannerDialog
          label="Inventario"
          title="Escanear codigo de producto"
          onClose={() =>
            setScannerTarget(null)
          }
          onDetected={applyScannedCode}
        />
      )}
    </form>
  );
}
