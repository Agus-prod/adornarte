type Props = {
  productId: string;
};

export function ProductInfoCard({
  productId,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Información del producto
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Aquí podrás editar toda la información
          general del producto.
        </p>

      </div>

      <div className="rounded-xl bg-pink-50 p-6 text-pink-700">

        Product ID

        <br />

        <strong>{productId}</strong>

      </div>

    </div>
  );
}