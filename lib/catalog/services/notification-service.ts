import { createNotification } from "@/lib/catalog/repositories/notification-repository";

export type NotificationChannel =
  | "email"
  | "whatsapp"
  | "sms"
  | "push";

export async function queueCatalogNotification(
  organizationId: string,
  channel: NotificationChannel,
  recipient: string,
  body: string,
  subject?: string | null,
  referenceType?: string | null,
  referenceId?: string | null
) {
  return createNotification({
    organization_id: organizationId,
    channel,
    recipient,
    body,
    subject: subject ?? null,
    reference_type:
      referenceType ?? null,
    reference_id: referenceId ?? null,
  });
}
