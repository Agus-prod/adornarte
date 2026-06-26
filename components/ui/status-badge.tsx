type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
};

const styles = {
  success:
    "bg-green-100 text-green-700",

  warning:
    "bg-yellow-100 text-yellow-700",

  danger:
    "bg-red-100 text-red-700",

  info:
    "bg-blue-100 text-blue-700",

  default:
    "bg-gray-100 text-gray-700",
};

export function StatusBadge({
  children,
  variant = "default",
}: Props) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
}