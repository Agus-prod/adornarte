import { createProductReview } from "@/app/catalogo/reviews/actions";
import { RatingInput } from "@/components/catalog/rating-input";
import type { CatalogReview } from "@/lib/catalog/repositories/review-repository";

type Props = {
  productId: string;
  productSlug: string;
  reviews: CatalogReview[];
};

function Stars({
  rating,
}: {
  rating: number;
}) {
  return (
    <span className="text-sm text-pink-600">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <span key={index}>
            {index < rating ? "★" : "☆"}
          </span>
        )
      )}
    </span>
  );
}

export function ProductReviews({
  productId,
  productSlug,
  reviews,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Opiniones
      </h2>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-5 text-sm text-gray-500">
              Aun no hay opiniones.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border bg-white p-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {review.customer_name}
                  </h3>
                  <Stars
                    rating={review.rating}
                  />
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
          className="space-y-3 rounded-2xl border bg-white p-4"
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
            className="min-h-10 w-full rounded-2xl border px-3 text-sm"
          />
          <input
            name="customer_email"
            type="email"
            required
            placeholder="Email"
            className="min-h-10 w-full rounded-2xl border px-3 text-sm"
          />
          <RatingInput
            name="rating"
            defaultValue={5}
          />
          <textarea
            name="comment"
            rows={3}
            placeholder="Comentario"
            className="w-full rounded-2xl border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="min-h-10 w-full rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Enviar opinion
          </button>
        </form>
      </div>
    </section>
  );
}
