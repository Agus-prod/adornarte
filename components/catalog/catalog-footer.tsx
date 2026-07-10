import Link from "next/link";
import { AdornarteBrandMark } from "@/components/brand/adornarte-brand-mark";

const shopLinks = [
  {
    href: "/catalogo",
    label: "Inicio",
  },
  {
    href: "/catalogo?onOffer=on",
    label: "Ofertas",
  },
  {
    href: "/catalogo#marcas",
    label: "Marcas",
  },
  {
    href: "/catalogo#categorias",
    label: "Categorias",
  },
  {
    href: "/catalogo/contacto",
    label: "Contacto",
  },
];

const legalLinks = [
  {
    href: "/catalogo/privacidad",
    label: "Politica de privacidad",
  },
  {
    href: "/catalogo/terminos",
    label: "Terminos y condiciones",
  },
  {
    href: "/catalogo/envios",
    label: "Envios y devoluciones",
  },
  {
    href: "/catalogo/faq",
    label: "Preguntas frecuentes",
  },
];

export function CatalogFooter() {
  return (
    <footer className="border-t border-pink-100 bg-[#fbfaf8] px-4 py-8 text-sm text-zinc-500">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <AdornarteBrandMark
            label="AdornArte Shop"
            subtitle="Resalta tu belleza"
            size="sm"
            variant="shop"
          />
          <p className="mt-4 max-w-sm leading-6">
            Tienda online creada por AdornArte Company para compras, pedidos y seguimiento de clientes.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-zinc-950">
            Tienda
          </h2>
          <nav className="mt-3 grid gap-2">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-pink-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-bold text-zinc-950">
            Ayuda y legal
          </h2>
          <nav className="mt-3 grid gap-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-pink-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-pink-100 pt-5 text-xs">
        © 2026 AdornArte Company. Todos los derechos reservados.
      </div>
    </footer>
  );
}
