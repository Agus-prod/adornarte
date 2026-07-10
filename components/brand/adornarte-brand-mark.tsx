import Image from "next/image";

type Props = {
  label?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  variant?: "app" | "shop";
};

const sizes = {
  sm: {
    image: "size-10",
    title: "text-base",
    subtitle: "text-xs",
  },
  md: {
    image: "size-12",
    title: "text-lg",
    subtitle: "text-xs",
  },
  lg: {
    image: "size-20",
    title: "text-2xl",
    subtitle: "text-sm",
  },
};

export function AdornarteBrandMark({
  label = "AdornArte",
  subtitle,
  size = "md",
  variant = "app",
}: Props) {
  const currentSize = sizes[size];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src="/adornarte-logo.jpg"
        alt={label}
        width={96}
        height={96}
        priority={size !== "sm"}
        className={`${currentSize.image} shrink-0 rounded-full border-2 border-pink-100 bg-white object-cover shadow-sm`}
      />
      <div className="min-w-0">
        <p
          className={`${currentSize.title} truncate font-black leading-tight ${
            variant === "shop"
              ? "text-zinc-950"
              : "bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent"
          }`}
        >
          {label}
        </p>
        {subtitle ? (
          <p
            className={`${currentSize.subtitle} truncate text-gray-500`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
