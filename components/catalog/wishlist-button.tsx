import { addWishlistItem } from "@/app/catalogo/wishlist/actions";

type Props = {
  productId: string;
};

export function WishlistButton({
  productId,
}: Props) {
  return (
    <form action={addWishlistItem}>
      <input
        type="hidden"
        name="product_id"
        value={productId}
      />
      <button
        type="submit"
        className="min-h-11 w-full rounded-lg border px-4 text-sm font-semibold hover:bg-gray-50"
      >
        Agregar a favoritos
      </button>
    </form>
  );
}
