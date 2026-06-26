"use client";

import {
  Control,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";

type FormSwitchProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
};

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: FormSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">

          <div>
            <p className="font-medium text-gray-900">
              {label}
            </p>

            {description && (
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`
              relative
              h-7
              w-12
              rounded-full
              transition
              ${
                field.value
                  ? "bg-pink-500"
                  : "bg-gray-300"
              }
            `}
          >
            <span
              className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow
                transition
                ${
                  field.value
                    ? "left-6"
                    : "left-1"
                }
              `}
            />
          </button>

        </div>
      )}
    />
  );
}