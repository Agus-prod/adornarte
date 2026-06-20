type Product = {
  id: string;
  name: string;
  sku: string | null;
  sale_price: number;
  stock: number;
};

type Props = {
  products: Product[];
};

export function ProductsTable({
  products,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        No hay productos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              SKU
            </th>

            <th className="p-4 text-left">
              Precio
            </th>

            <th className="p-4 text-left">
              Stock
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="p-4">
                {product.name}
              </td>

              <td className="p-4">
                {product.sku}
              </td>

              <td className="p-4">
                L {product.sale_price}
              </td>

              <td className="p-4">
                {product.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}