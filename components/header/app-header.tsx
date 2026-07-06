import { dismissAllAppNotifications, dismissAppNotification } from "@/app/(dashboard)/notificaciones/actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { MobileNavigation } from "@/components/sidebar/mobile-navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAppNotifications } from "@/lib/notifications/get-app-notifications";
import {
  Bell,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";

export async function AppHeader() {
  const user = await getCurrentUser();
  const notifications =
    await getAppNotifications();

  return (
    <header
      data-app-chrome
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/60
        bg-white/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-3
          sm:px-4
          md:px-8
          py-3
          md:py-4
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <MobileNavigation />
          <div className="min-w-0">
          <h1
            className="
              truncate
              text-lg
              sm:text-xl
              md:text-2xl
              font-bold
              bg-gradient-to-r
              from-pink-500
              to-fuchsia-500
              bg-clip-text
              text-transparent
            "
          >
            AdornArte
          </h1>

          <p className="text-xs md:text-sm text-gray-500">
            Sistema de Gestión
          </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-4">
          <details className="group relative">
            <summary
              className="
                relative
                flex
                cursor-pointer
                list-none
                items-center
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-2.5
                sm:p-3
                text-gray-500
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
                hover:text-pink-600
              "
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-pink-600 px-1.5 text-xs font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </summary>

            <div className="fixed inset-x-3 top-[4.75rem] z-50 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-pink-100 bg-white p-4 shadow-2xl shadow-pink-100/70 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96 sm:max-w-[calc(100vw-2rem)] sm:rounded-3xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-pink-600">
                    Notificaciones
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    Pendientes del día
                  </h2>
                </div>

                {notifications.length > 0 && (
                  <form
                    action={
                      dismissAllAppNotifications
                    }
                  >
                    {notifications.map(
                      (notification) => (
                        <input
                          key={notification.id}
                          type="hidden"
                          name="notification_ids"
                          value={notification.id}
                        />
                      )
                    )}
                    <button
                      type="submit"
                      title="Limpiar todo"
                      aria-label="Limpiar todas las notificaciones"
                      className="flex size-9 items-center justify-center rounded-full border border-zinc-100 text-zinc-500 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
                {notifications.length ? (
                  notifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        className="flex gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-3 transition hover:border-pink-200 hover:bg-pink-50"
                      >
                        <a
                          href={notification.href}
                          className="min-w-0 flex-1"
                        >
                          <p className="font-semibold text-zinc-950">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {notification.description}
                          </p>
                        </a>
                        <form
                          action={
                            dismissAppNotification
                          }
                        >
                          <input
                            type="hidden"
                            name="notification_id"
                            value={notification.id}
                          />
                          <button
                            type="submit"
                            title="Borrar notificación"
                            aria-label="Borrar notificación"
                            className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white hover:text-pink-700"
                          >
                            <X size={15} />
                          </button>
                        </form>
                      </div>
                    )
                  )
                ) : (
                  <p className="rounded-2xl border border-dashed p-4 text-sm text-zinc-500">
                    No hay pendientes importantes.
                  </p>
                )}
              </div>
            </div>
          </details>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              rounded-2xl
              border
              border-gray-100
              bg-white
              px-4
              py-2
              shadow-sm
            "
          >
            <div
              className="
                rounded-full
                bg-pink-100
                p-2
                text-pink-600
              "
            >
              <UserCircle2 size={24} />
            </div>

            <div>
              <p className="font-medium text-sm">
                {user?.email ?? "Usuario"}
              </p>

              <p className="text-xs text-gray-500">
                Administrador
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
