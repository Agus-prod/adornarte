import { AdminLayout } from "@/components/layouts/admin-layout";

export default function HomePage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Bienvenido a AdornArte
        </p>
      </div>
    </AdminLayout>
  );
}