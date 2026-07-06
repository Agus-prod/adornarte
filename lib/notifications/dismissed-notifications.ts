import { cookies } from "next/headers";

const dismissedNotificationsCookie =
  "adornarte_dismissed_notifications";
const maxDismissedNotifications = 100;

export async function getDismissedNotificationIds() {
  const cookieStore = await cookies();
  const value =
    cookieStore.get(
      dismissedNotificationsCookie
    )?.value ?? "";

  return new Set(
    value
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

export async function dismissNotificationIds(
  notificationIds: string[]
) {
  const cookieStore = await cookies();
  const dismissedIds =
    await getDismissedNotificationIds();

  for (const notificationId of notificationIds) {
    if (notificationId) {
      dismissedIds.add(notificationId);
    }
  }

  const value = Array.from(dismissedIds)
    .slice(-maxDismissedNotifications)
    .join(",");

  cookieStore.set(
    dismissedNotificationsCookie,
    value,
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    }
  );
}
