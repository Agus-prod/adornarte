import Image from "next/image";
import type { ProductImage } from "@/lib/catalog/repositories/image-repository";

type Props = {
  productName: string;
  fallbackImageUrl: string | null;
  images: ProductImage[];
};

export function ProductGallery({
  productName,
  fallbackImageUrl,
  images,
}: Props) {
  const galleryImages =
    images.length > 0
      ? images
      : fallbackImageUrl
        ? [
            {
              id: fallbackImageUrl,
              url: fallbackImageUrl,
              alt_text: productName,
            },
          ]
        : [];

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border bg-gray-50 text-sm text-gray-400">
        Sin imagen
      </div>
    );
  }

  const [primaryImage, ...otherImages] =
    galleryImages;

  return (
    <div className="space-y-3">
      <Image
        src={primaryImage.url}
        alt={
          primaryImage.alt_text ??
          productName
        }
        width={900}
        height={900}
        unoptimized
        className="aspect-square w-full rounded-lg border object-cover"
      />

      {otherImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {otherImages.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={
                image.alt_text ??
                productName
              }
              width={180}
              height={180}
              unoptimized
              className="aspect-square rounded-lg border object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
