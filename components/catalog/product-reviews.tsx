import { createProductReview } from "@/app/catalogo/reviews/actions";
import type { CatalogReview } from "@/lib/catalog/repositories/review-repository";

type Props = {
  productId: string;
  productSlug: string;
  reviews: CatalogReview[];
};

export function ProductReviews({
  productId,
  productSlug,
  reviews,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Reviews
      </h2>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-lg border border-dashed p-5 text-sm text-gray-500">
              Aun no hay reviews aprobadas.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border bg-white p-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {review.customer_name}
                  </h3>
                  <span className="text-sm text-pink-600">
                    {review.rating}/5
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {review.comment}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        <form
          action={createProductReview.bind(
            null,
            productSlug
          )}
          className="space-y-3 rounded-lg border bg-white p-4"
        >
          <input
            type="hidden"
            name="product_id"
            value={productId}
          />
          <input
            name="customer_name"
            required
            placeholder="Nombre"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            name="customer_email"
            type="email"
            required
            placeholder="Email"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <select
            name="rating"
            defaultValue="5"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <input
            name="photo_url"
            placeholder="URL foto"
            className="min-h-10 w-full rounded-lg border px-3 text-sm"
          />
          <textarea
            name="comment"
            rows={3}
            placeholder="Comentario"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="min-h-10 w-full rounded-lg bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Enviar review
          </button>
        </form>
      </div>
    </section>
  );
}
