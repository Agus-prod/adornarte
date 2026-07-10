export const userRoles = [
  "admin",
  "caja",
  "inventario",
  "vendedor",
] as const;

export type UserRole =
  (typeof userRoles)[number];

export type RoleScope = {
  label: string;
  description: string;
  allowedPaths: readonly string[];
  capabilities: readonly string[];
};

export const roleScopes = {
  admin: {
    label: "Administrador",
    description:
      "Control total del ERP, Commerce, POS, reportes, configuracion y usuarios.",
    allowedPaths: ["/"],
    capabilities: [
      "Administrar usuarios, roles y configuracion.",
      "Gestionar inventario, compras, ventas, caja y clientes.",
      "Configurar Commerce, cupones, marcas y catalogo.",
      "Ver reportes, creditos, facturas e historial completo.",
    ],
  },
  caja: {
    label: "Caja",
    description:
      "Operacion diaria de caja, cobros, POS, ventas y clientes.",
    allowedPaths: [
      "/",
      "/pos",
      "/ventas",
      "/caja",
      "/clientes",
    ],
    capabilities: [
      "Crear ventas desde POS.",
      "Registrar pagos, abonos y cierres de caja.",
      "Consultar clientes para cobros y atencion.",
      "Ver ventas y facturas necesarias para operar caja.",
    ],
  },
  inventario: {
    label: "Inventario",
    description:
      "Productos, stock, movimientos, compras, proveedores y marcas del catalogo.",
    allowedPaths: [
      "/",
      "/inventario",
      "/compras",
      "/catalogo/marcas",
    ],
    capabilities: [
      "Crear y editar productos.",
      "Administrar stock, variantes y movimientos.",
      "Gestionar compras, recepcion y proveedores.",
      "Mantener marcas visibles en el catalogo.",
    ],
  },
  vendedor: {
    label: "Vendedor",
    description:
      "Ventas, POS y atencion al cliente sin acceso a configuracion sensible.",
    allowedPaths: [
      "/",
      "/pos",
      "/ventas",
      "/clientes",
    ],
    capabilities: [
      "Crear ventas y pedidos desde POS.",
      "Consultar clientes para seguimiento.",
      "Ver ventas operativas.",
      "Atender pedidos sin cambiar configuracion del sistema.",
    ],
  },
} satisfies Record<UserRole, RoleScope>;

export function normalizeUserRole(
  role: string | null | undefined
): UserRole {
  if (
    userRoles.includes(role as UserRole)
  ) {
    return role as UserRole;
  }

  return "vendedor";
}

export function canAccessPath(
  role: UserRole,
  pathname: string
) {
  if (role === "admin") {
    return true;
  }

  const cleanPath =
    pathname === "" ? "/" : pathname;

  return roleScopes[
    role
  ].allowedPaths.some((allowedPath) => {
    if (allowedPath === "/") {
      return cleanPath === "/";
    }

    return (
      cleanPath === allowedPath ||
      cleanPath.startsWith(
        `${allowedPath}/`
      )
    );
  });
}
