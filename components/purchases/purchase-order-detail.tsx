import { Button } from "@/components/ui/button";

type Supplier = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
};

type PurchaseOrder = {
  id: string;
  number: string | null;
  status: string;
  order_date: string;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  supplier: Supplier | null;
};

type Props = {
  order: PurchaseOrder;
};

export function PurchaseOrderDetail({
  order,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              {order.number}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orden de compra
            </p>

          </div>

          <span
            className="
              rounded-full
              bg-yellow-100
              px-3
              py-1
              text-sm
              font-medium
              text-yellow-800
            "
          >
            {order.status}
          </span>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>

            <p className="text-sm text-gray-500">
              Proveedor
            </p>

            <p className="mt-1 font-semibold">
              {order.supplier?.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Fecha
            </p>

            <p className="mt-1 font-semibold">
              {order.order_date}
            </p>

          </div>
                  </div>

        {order.notes && (
          <div className="mt-8">

            <p className="text-sm text-gray-500">
              Observaciones
            </p>

            <div className="mt-2 rounded-xl bg-gray-50 p-4">
              {order.notes}
            </div>

          </div>
        )}

      </div>

      <div className="rounded-2xl border border-dashed bg-white p-10">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold">
              Productos
            </h3>

            <p className="text-sm text-gray-500">
              Agregue los productos que recibirá esta orden.
            </p>

          </div>

          <Button>
            + Agregar producto
          </Button>

        </div>

        <div className="mt-10 rounded-xl border border-dashed py-16 text-center">

          <p className="text-lg font-medium text-gray-500">
            Aún no hay productos.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Presione "Agregar producto" para comenzar.
          </p>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold">
          Totales
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">

            <span className="text-gray-500">
              Subtotal
            </span>

            <strong>
              Q {order.subtotal.toFixed(2)}
            </strong>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">
              Impuesto
            </span>

            <strong>
              Q {order.tax.toFixed(2)}
            </strong>

          </div>
                    <div className="flex justify-between border-t pt-4 text-lg">

            <span className="font-semibold">
              Total
            </span>

            <strong>
              Q {order.total.toFixed(2)}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}