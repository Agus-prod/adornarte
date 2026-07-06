"use server";

import { revalidatePath } from "next/cache";
import { dismissNotificationIds } from "@/lib/notifications/dismissed-notifications";

export async function dismissAppNotification(
  formData: FormData
) {
  const notificationId =
    formData.get("notification_id")?.toString() ??
    "";

  await dismissNotificationIds([
    notificationId,
  ]);

  revalidatePath("/", "layout");
}

export async function dismissAllAppNotifications(
  formData: FormData
) {
  const notificationIds = formData
    .getAll("notification_ids")
    .map((value) => value.toString())
    .filter(Boolean);

  await dismissNotificationIds(
    notificationIds
  );

  revalidatePath("/", "layout");
}
