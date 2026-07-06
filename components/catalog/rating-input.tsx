"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  name: string;
  defaultValue?: number;
};

export function RatingInput({
  name,
  defaultValue = 5,
}: Props) {
  const [rating, setRating] =
    useState(defaultValue);

  return (
    <div className="space-y-2">
      <input
        type="hidden"
        name={name}
        value={rating}
      />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`${value} estrellas`}
            className="rounded-md p-1 text-pink-500 transition hover:bg-pink-50"
          >
            <Star
              size={26}
              className={
                value <= rating
                  ? "fill-pink-500"
                  : "fill-transparent"
              }
            />
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500">
        {rating} de 5 estrellas
      </p>
    </div>
  );
}
