import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getDismissedNotificationIds } from "@/lib/notifications/dismissed-notifications";
import { createAdminClient } from "@/lib/supabase/admin";

export type AppNotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "pink" | "amber" | "zinc";
};

export async function getAppNotifications() {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    return [];
  }

  const supabase = createAdminClient();
  const [
    ordersResult,
    transfersResult,
    creditsResult,
    onlineCustomersResult,
  ] = await Promise.all([
    supabase
      .from("catalog_orders")
      .select("id, order_number, total, status")
      .eq(
        "organization_id",
        profile.organization_id
      )
      .in("status", [
        "pending",
        "paid",
        "preparing",
      ])
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
    supabase
      .from("catalog_payments")
      .select("id, amount, receipt_image_path")
      .eq(
        "organization_id",
        profile.organization_id
      )
      .eq("method", "transfer")
      .eq("status", "pending")
      .not(
        "receipt_image_path",
        "is",
        null
      )
      .limit(5),
    supabase
      .from("customers")
      .select("id, name, current_balance")
      .eq(
        "organization_id",
        profile.organization_id
      )
      .gt("current_balance", 0)
      .order("current_balance", {
        ascending: false,
      })
      .limit(5),
    supabase
      .from("catalog_customers")
      .select("id, name, email, created_at")
      .eq(
        "organization_id",
        profile.organization_id
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  if (transfersResult.error) {
    throw transfersResult.error;
  }

  if (creditsResult.error) {
    throw creditsResult.error;
  }

  if (onlineCustomersResult.error) {
    throw onlineCustomersResult.error;
  }

  const orders =
    ordersResult.data.map((order) => ({
      id: `order-${order.id}`,
      title: "Pedido Commerce",
      description: `${order.order_number} - L ${Number(order.total).toFixed(2)} (${order.status})`,
      href: "/ventas",
      tone: "pink" as const,
    }));
  const transfers =
    transfersResult.data.map(
      (payment) => ({
        id: `transfer-${payment.id}`,
        title: "Transferencia por revisar",
        description: `Comprobante por L ${Number(payment.amount).toFixed(2)}`,
        href: "/ventas",
        tone: "amber" as const,
      })
    );
  const credits =
    creditsResult.data.map((customer) => ({
      id: `credit-${customer.id}`,
      title: "Crédito pendiente",
      description: `${customer.name} debe L ${Number(customer.current_balance ?? 0).toFixed(2)}`,
      href: `/clientes/${customer.id}`,
      tone: "zinc" as const,
    }));
  const onlineCustomers =
    onlineCustomersResult.data.map(
      (customer) => ({
        id: `online-customer-${customer.id}`,
        title: "Nuevo cliente Tienda Online",
        description: `${customer.name} - ${customer.email}`,
        href: "/clientes",
        tone: "pink" as const,
      })
    );

  const dismissedIds =
    await getDismissedNotificationIds();

  return [
    ...onlineCustomers,
    ...orders,
    ...transfers,
    ...credits,
  ].filter(
    (notification) =>
      !dismissedIds.has(notification.id)
  ) satisfies AppNotificationItem[];
}
