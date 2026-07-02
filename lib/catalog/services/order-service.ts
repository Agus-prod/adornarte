import { updateCart } from "@/lib/catalog/repositories/cart-repository";
import {
  createOrder,
  createOrderItems,
} from "@/lib/catalog/repositories/order-repository";
import { updatePayment } from "@/lib/catalog/repositories/payment-repository";
import { getCartDetail } from "@/lib/catalog/services/cart-service";
import { getCurrentCartPayments } from "@/lib/catalog/services/payment-service";

function getOrderNumber() {
  return `WEB-${Date.now()}`;
}

function assertCheckoutValue(
  value: string | null,
  message: string
) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export async function createOrderFromCurrentCart() {
  const cart = await getCartDetail();

  if (!cart || cart.items.length === 0) {
    throw new Error("Carrito vacio.");
  }

  const payments =
    await getCurrentCartPayments();
  const hasPaidPayment = payments.some(
    (payment) => payment.status === "paid"
  );
  const order = await createOrder({
    organization_id:
      cart.cart.organization_id,
    cart_id: cart.cart.id,
    order_number: getOrderNumber(),
    status: hasPaidPayment
      ? "paid"
      : "pending",
    customer_name:
      assertCheckoutValue(
        cart.cart.customer_name,
        "Nombre requerido."
      ),
    customer_email:
      assertCheckoutValue(
        cart.cart.customer_email,
        "Email requerido."
      ),
    customer_phone:
      assertCheckoutValue(
        cart.cart.customer_phone,
        "Telefono requerido."
      ),
    shipping_address:
      assertCheckoutValue(
        cart.cart.shipping_address,
        "Direccion requerida."
      ),
    shipping_city:
      assertCheckoutValue(
        cart.cart.shipping_city,
        "Ciudad requerida."
      ),
    shipping_notes:
      cart.cart.shipping_notes,
    payment_method:
      cart.cart.payment_method,
    subtotal: cart.totals.subtotal,
    discount_total:
      cart.totals.discountTotal,
    shipping_total:
      cart.totals.shippingTotal,
    tax_total: cart.totals.taxTotal,
    total: cart.totals.total,
  });

  await createOrderItems(
    cart.items.map((item) => ({
      organization_id:
        cart.cart.organization_id,
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name,
      sku: item.sku,
      image_url: item.image_url,
      quantity: item.quantity,
      unit_price: Number(
        item.unit_price
      ),
      total:
        Number(item.unit_price) *
        item.quantity,
      notes: item.notes,
    }))
  );

  await Promise.all(
    payments.map((payment) =>
      updatePayment(
        payment.id,
        payment.organization_id,
        {
          order_id: order.id,
          updated_at:
            new Date().toISOString(),
        }
      )
    )
  );

  await updateCart(
    cart.cart.id,
    cart.cart.organization_id,
    {
      status: "converted",
      updated_at: new Date().toISOString(),
    }
  );

  return order;
}
