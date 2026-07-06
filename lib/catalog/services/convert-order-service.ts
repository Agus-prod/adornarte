import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import {
  getOrder,
  getOrderItems,
  updateOrder,
} from "@/lib/catalog/repositories/order-repository";
import { getOpenCash } from "@/lib/cash/get-open-cash";
import { syncCatalogCustomerToErp } from "@/lib/customers/sync-catalog-customer";
import { createAdminClient } from "@/lib/supabase/admin";

function mapPaymentMethod(
  method: string | null
) {
  if (method === "transfer") {
    return "TRANSFER";
  }

  if (method === "stripe" || method === "paypal") {
    return "CARD";
  }

  return "CASH";
}

export async function convertCatalogOrderToSale(
  orderId: string
) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    throw new Error(
      "Usuario no autenticado."
    );
  }

  const order = await getOrder(
    orderId,
    profile.organization_id
  );

  if (order.sale_id) {
    throw new Error(
      "Este pedido ya fue convertido en venta."
    );
  }

  if (
    order.status === "cancelled" ||
    order.status === "delivered"
  ) {
    throw new Error(
      "Este pedido no se puede convertir."
    );
  }

  const items = await getOrderItems(
    order.id,
    profile.organization_id
  );

  if (!items.length) {
    throw new Error(
      "El pedido no tiene productos."
    );
  }

  const saleItems = items.map((item) => {
    if (!item.product_id) {
      throw new Error(
        "El pedido contiene un producto no vinculado al ERP."
      );
    }

    return {
      productId: item.product_id,
      quantity: item.quantity,
      price: Number(item.unit_price),
    };
  });

  const supabase = createAdminClient();
  const cash = await getOpenCash();
  const customer =
    await syncCatalogCustomerToErp({
      organizationId:
        profile.organization_id,
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
    });
  const paymentMethod = mapPaymentMethod(
    order.payment_method
  );
  const paidAmount =
    order.status === "paid"
      ? Number(order.total)
      : 0;

  for (const item of saleItems) {
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("id, name, stock")
      .eq("id", item.productId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

    if (productError) {
      throw productError;
    }

    const stock = Number(
      product.stock ?? 0
    );

    if (stock < item.quantity) {
      throw new Error(
        `Stock insuficiente para ${product.name}.`
      );
    }
  }

  const { data: sale, error: saleError } =
    await supabase
      .from("sales")
      .insert({
        organization_id:
          profile.organization_id,
        customer_id: customer.id,
        total: Number(order.total),
        paid_amount: paidAmount,
        pending_amount:
          Number(order.total) - paidAmount,
        payment_method: paymentMethod,
        payment_status:
          paidAmount >= Number(order.total)
            ? "PAID"
            : "PENDING",
        cash_closing_id:
          cash?.id ?? null,
      })
      .select()
      .single();

  if (saleError) {
    throw saleError;
  }

  const { error: itemsError } =
    await supabase
      .from("sale_items")
      .insert(
        saleItems.map((item) => ({
          sale_id: sale.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      );

  if (itemsError) {
    throw itemsError;
  }

  if (paidAmount > 0) {
    const { error: paymentError } =
      await supabase
        .from("sale_payments")
        .insert({
          organization_id:
            profile.organization_id,
          sale_id: sale.id,
          amount: paidAmount,
          method: paymentMethod,
          cash_closing_id:
            cash?.id ?? null,
          reference:
            order.order_number,
          created_by: profile.id,
        });

    if (paymentError) {
      throw paymentError;
    }
  }

  for (const item of saleItems) {
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("id, stock")
      .eq("id", item.productId)
      .eq(
        "organization_id",
        profile.organization_id
      )
      .single();

    if (productError) {
      throw productError;
    }

    const newStock =
      Number(product.stock ?? 0) -
      item.quantity;

    const { error: stockError } =
      await supabase
        .from("products")
        .update({
          stock: newStock,
        })
        .eq("id", product.id)
        .eq(
          "organization_id",
          profile.organization_id
        );

    if (stockError) {
      throw stockError;
    }

    const { error: movementError } =
      await supabase
        .from("stock_movements")
        .insert({
          organization_id:
            profile.organization_id,
          product_id: product.id,
          movement_type: "SALE",
          quantity: -item.quantity,
          reference_type:
            "CATALOG_ORDER",
          reference_id: order.id,
          notes: `Pedido ${order.order_number}`,
          created_by: profile.id,
        });

    if (movementError) {
      throw movementError;
    }
  }

  await updateOrder(
    order.id,
    profile.organization_id,
    {
      sale_id: sale.id,
      status: "preparing",
      updated_at: new Date().toISOString(),
    }
  );

  return sale;
}
