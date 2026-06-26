type SearchInputProps = {
  placeholder?: string;
};

export function SearchInput({
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-3
        outline-none
        transition
        focus:border-pink-500
      "
    />
  );
}