import { createCouponAction } from "@/app/(dashboard)/configuracion/cupones/actions";
import { getCouponManagementView } from "@/lib/catalog/services/coupon-management-service";
import type { CatalogCoupon } from "@/lib/catalog/repositories/coupon-repository";

function getCouponStatus(
  coupon: CatalogCoupon
) {
  const now = Date.now();

  if (!coupon.is_active) {
    return "Inactivo";
  }

  if (
    coupon.starts_at &&
    new Date(coupon.starts_at).getTime() > now
  ) {
    return "Programado";
  }

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at).getTime() < now
  ) {
    return "Vencido";
  }

  if (
    coupon.usage_limit !== null &&
    coupon.used_count >= coupon.usage_limit
  ) {
    return "Agotado";
  }

  return "Activo";
}

export default async function CuponesPage() {
  const { coupons, customers } =
    await getCouponManagementView();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Cupones
        </h1>
        <p className="mt-2 text-gray-500">
          Crea cupones generales o personalizados para clientes.
        </p>
      </div>

      <form
        action={createCouponAction}
        className="grid gap-4 rounded-3xl border bg-white p-6 shadow-sm lg:grid-cols-4"
      >
        <input
          name="name"
          required
          placeholder="Nombre"
          className="min-h-11 rounded-2xl border px-3 text-sm"
        />
        <input
          name="code"
          required
          placeholder="Codigo"
          className="min-h-11 rounded-2xl border px-3 text-sm uppercase"
        />
        <select
          name="type"
          className="min-h-11 rounded-2xl border px-3 text-sm"
          defaultValue="percent"
        >
          <option value="percent">
            Porcentaje (%)
          </option>
          <option value="amount">
            Monto fijo (L)
          </option>
          <option value="free_shipping">
            Envio gratis
          </option>
        </select>
        <input
          name="value"
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor"
          className="min-h-11 rounded-2xl border px-3 text-sm"
        />
        <input
          name="minimum_subtotal"
          type="number"
          min="0"
          step="0.01"
          placeholder="Compra minima"
          className="min-h-11 rounded-2xl border px-3 text-sm"
        />
        <input
          name="usage_limit"
          type="number"
          min="0"
          placeholder="Limite de usos"
          className="min-h-11 rounded-2xl border px-3 text-sm"
        />
        <input
          name="expires_at"
          type="datetime-local"
          className="min-h-11 rounded-2xl border px-3 text-sm"
        />
        <select
          name="customer_id"
          className="min-h-11 rounded-2xl border px-3 text-sm"
          defaultValue=""
        >
          <option value="">
            Todos los clientes
          </option>
          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}{" "}
              {customer.email
                ? `(${customer.email})`
                : ""}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked
          />
          Activo
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-2xl bg-pink-600 px-4 text-sm font-semibold text-white hover:bg-pink-700 lg:col-span-3"
        >
          Crear cupon
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Codigo</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Usos</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-t"
              >
                <td className="p-4 font-bold text-pink-600">
                  {coupon.code}
                </td>
                <td className="p-4">
                  {coupon.name}
                </td>
                <td className="p-4">
                  {coupon.type ===
                  "percent"
                    ? "Porcentaje"
                    : coupon.type ===
                        "amount"
                      ? "Monto fijo"
                      : "Envio gratis"}
                </td>
                <td className="p-4">
                  {coupon.type ===
                  "free_shipping"
                    ? "Envio"
                    : coupon.type ===
                        "percent"
                      ? `${Number(coupon.value).toFixed(2)}%`
                      : `L ${Number(coupon.value).toFixed(2)}`}
                </td>
                <td className="p-4">
                  {coupon.used_count}
                  {coupon.usage_limit
                    ? ` / ${coupon.usage_limit}`
                    : ""}
                </td>
                <td className="p-4">
                  {getCouponStatus(coupon)}
                </td>
              </tr>
            ))}
            {!coupons.length && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No hay cupones creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
