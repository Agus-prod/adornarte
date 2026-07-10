"use client";

import {
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import type { ProductImage } from "@/lib/catalog/repositories/image-repository";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  image?: ProductImage;
  mode: "create" | "edit";
  variantNames?: string[];
};

const maxImageSize = 1600;
const imageQuality = 0.82;

function getOptimizedFileName(
  fileName: string
) {
  return fileName.replace(
    /\.[^.]+$/,
    ".webp"
  );
}

function loadImage(
  file: File
) {
  return new Promise<HTMLImageElement>(
    (resolve, reject) => {
      const image = new window.Image();
      const url =
        URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(
          new Error(
            "No se pudo optimizar la imagen."
          )
        );
      };

      image.src = url;
    }
  );
}

async function optimizeImage(
  file: File
) {
  const image =
    await loadImage(file);

  const scale = Math.min(
    1,
    maxImageSize /
      Math.max(
        image.width,
        image.height
      )
  );

  const width = Math.round(
    image.width * scale
  );

  const height = Math.round(
    image.height * scale
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const blob =
    await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          "image/webp",
          imageQuality
        )
    );

  if (!blob) {
    return file;
  }

  if (blob.size >= file.size) {
    return file;
  }

  return new File(
    [blob],
    getOptimizedFileName(file.name),
    {
      type: "image/webp",
    }
  );
}

export function ImageForm({
  action,
  submitLabel,
  image,
  mode,
  variantNames = [],
}: Props) {
  const formRef =
    useRef<HTMLFormElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const optimizedRef =
    useRef(false);

  const [isOptimizing, setIsOptimizing] =
    useState(false);
  const variantListId = image
    ? `product-image-variants-${image.id}`
    : "product-image-variants-new";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    if (
      mode !== "create" ||
      optimizedRef.current
    ) {
      optimizedRef.current = false;
      return;
    }

    const file =
      fileInputRef.current?.files?.[0];

    if (!file) {
      return;
    }

    event.preventDefault();
    setIsOptimizing(true);

    try {
      const optimized =
        await optimizeImage(file);

      const dataTransfer =
        new DataTransfer();

      dataTransfer.items.add(optimized);

      if (fileInputRef.current) {
        fileInputRef.current.files =
          dataTransfer.files;
      }

      optimizedRef.current = true;
      formRef.current?.requestSubmit();
    } finally {
      setIsOptimizing(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      action={action}
      className="space-y-4"
    >
      {mode === "create" && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Imagen
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            required
            className="w-full rounded-xl border p-3"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Texto alternativo
          </label>

          <input
            name="alt_text"
            defaultValue={image?.alt_text ?? ""}
            list={
              variantNames.length > 0
                ? variantListId
                : undefined
            }
            className="w-full rounded-xl border p-3"
          />
          {variantNames.length > 0 && (
            <>
              <datalist id={variantListId}>
                {variantNames.map((name) => (
                  <option
                    key={name}
                    value={name}
                  />
                ))}
              </datalist>
              <p className="mt-2 text-xs text-gray-500">
                Para cambiar la imagen automaticamente al elegir un tono, usa el nombre exacto de la variante.
              </p>
            </>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Orden
          </label>

          <input
            type="number"
            name="sort_order"
            defaultValue={image?.sort_order ?? 0}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="is_primary"
          defaultChecked={image?.is_primary ?? false}
          className="h-4 w-4"
        />

        Imagen principal
      </label>

      <button
        type="submit"
        disabled={isOptimizing}
        className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
      >
        {isOptimizing
          ? "Optimizando..."
          : submitLabel}
      </button>
    </form>
  );
}
