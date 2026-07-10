import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccessDenied } from "@/components/auth/access-denied";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { canAccessPath } from "@/lib/auth/roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile =
    await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const requestHeaders =
    await headers();
  const pathname =
    requestHeaders.get("x-pathname") ?? "/";
  const canAccess = canAccessPath(
    profile.role,
    pathname
  );

  return (
    <AdminLayout profile={profile}>
      {canAccess ? (
        children
      ) : (
        <AccessDenied
          role={profile.role}
          pathname={pathname}
        />
      )}
    </AdminLayout>
  );
}
