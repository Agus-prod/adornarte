import {
  BadgeCheck,
  BarChart3,
  LockKeyhole,
  PackageCheck,
  ShoppingBag,
  Store,
} from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { AdornarteBrandMark } from "@/components/brand/adornarte-brand-mark";

const modules = [
  "ERP",
  "POS",
  "Commerce",
  "Inventario",
  "Clientes",
  "Caja",
];

const highlights = [
  {
    icon: Store,
    title: "Operacion centralizada",
    description:
      "Ventas, caja, catalogo e inventario conectados en un solo panel.",
  },
  {
    icon: PackageCheck,
    title: "Inventario confiable",
    description:
      "Stock, movimientos y productos listos para vender en tienda o web.",
  },
  {
    icon: BarChart3,
    title: "Control diario",
    description:
      "Reportes, pedidos y actividad comercial con visibilidad para administrar.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7fb] text-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden border-r border-pink-100 bg-[radial-gradient(circle_at_18%_18%,#fce7f3,transparent_28%),radial-gradient(circle_at_78%_30%,#ede9fe,transparent_30%),linear-gradient(135deg,#fff_0%,#fff7fb_46%,#f8f5ff_100%)] px-10 py-10 lg:flex lg:flex-col">
          <div className="flex items-center justify-between">
            <AdornarteBrandMark
              label="AdornArte"
              subtitle="Resalta tu belleza"
              size="md"
            />
            <span className="rounded-full border border-pink-100 bg-white/70 px-4 py-2 text-xs font-bold uppercase text-pink-600 shadow-sm">
              Backoffice
            </span>
          </div>

          <div className="flex flex-1 items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-600">
                Sistema profesional
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight xl:text-6xl">
                Gestiona belleza, ventas e inventario con una sola plataforma.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Accede al centro operativo de AdornArte para vender mas rapido, controlar productos y mantener cada pedido bajo control.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {modules.map((module) => (
                  <span
                    key={module}
                    className="rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-pink-100 bg-white/75 p-5 shadow-sm backdrop-blur"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="mt-4 font-black">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-[29rem]">
            <div className="mb-8 flex justify-center lg:hidden">
              <AdornarteBrandMark
                label="AdornArte"
                subtitle="Sistema de Gestion"
                size="lg"
              />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-2xl shadow-pink-100/70">
              <div className="border-b border-pink-50 bg-gradient-to-br from-white to-pink-50/70 px-7 py-7">
                <div className="flex items-center justify-between gap-4">
                  <AdornarteBrandMark
                    label="AdornArte"
                    subtitle="Sistema POS Profesional"
                    size="md"
                  />
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <LockKeyhole
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h2 className="mt-7 text-2xl font-black tracking-tight">
                  Bienvenido de nuevo
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Ingresa con tu usuario autorizado para continuar trabajando.
                </p>
              </div>

              <div className="px-7 py-7">
                <LoginForm />
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-zinc-500 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-2xl border border-pink-100 bg-white/70 px-4 py-3">
                <BadgeCheck
                  className="size-4 text-pink-600"
                  aria-hidden="true"
                />
                Acceso por roles
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-pink-100 bg-white/70 px-4 py-3">
                <ShoppingBag
                  className="size-4 text-pink-600"
                  aria-hidden="true"
                />
                Commerce conectado
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
