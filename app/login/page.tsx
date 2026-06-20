import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-pink-500">
          AdornArte
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Sistema POS Profesional
        </p>

        <LoginForm />
      </div>
    </main>
  );
}