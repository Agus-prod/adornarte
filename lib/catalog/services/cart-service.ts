import { cookies } from "next/headers";
import {
  createCart,
  createCartItem,
  createCartRealtimeEvent,
  deleteCartItem,
  getCart,
  getCartItemByProduct,
  getCartItems,
  updateCart,
  updateCartItem,
  type CatalogCart,
  type CatalogCartItem,
} from "@/lib/catalog/repositories/cart-repository";
import { getCatalogProductById } from "@/lib/catalog/repositories/product-repository";
import { getVariant } from "@/lib/catalog/repositories/variant-repository";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import {
  getCouponDiscount,
  getValidCouponByCode,
} from "@/lib/catalog/services/coupon-service";
import {
  getCurrentCustomerEmail,
  saveCustomerProfile,
} from "@/lib/catalog/services/customer-service";
import type {
  CatalogCartDetail,
  CatalogCartTotals,
} from "@/lib/catalog/types";

const cartCookieName =
  "adornarte_catalog_cart_id";

function readText(
  formData: FormData,
  key: string
) {
  return formData
    .get(key)
    ?.toString()
    .trim() ?? "";
}

function readOptionalText(
  formData: FormData,
  key: string
) {
  const value = readText(
    formData,
    key
  );

  return value || null;
}

function readQuantity(formData: FormData) {
  const value = Number(
    readText(formData, "quantity")
  );

  return Number.isInteger(value) &&
    value > 0
    ? value
    : 1;
}

function getOrganizationId() {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    throw new Error(
      "Catalogo no configurado."
    );
  }

  return organizationId;
}

function getTotals(
  items: CatalogCartItem[],
  discountTotal = 0,
  shippingTotal = 0,
  taxTotal = 0
): CatalogCartTotals {
  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.unit_price) *
        item.quantity,
    0
  );

  return {
    subtotal,
    discountTotal,
    shippingTotal,
    taxTotal,
    total:
      subtotal -
      discountTotal +
      shippingTotal +
      taxTotal,
  };
}

async function persistTotals(
  cart: CatalogCart,
  items: CatalogCartItem[]
) {
  const subtotal = getTotals(items).subtotal;
  const coupon = cart.coupon_code
    ? await getValidCouponByCode(
        cart.organization_id,
        cart.coupon_code,
        subtotal,
        cart.customer_email ??
          (await getCurrentCustomerEmail())
      )
    : null;
  const shippingTotal =
    Number(cart.shipping_total) || 0;
  const taxTotal =
    Number(cart.tax_total) || 0;
  const totals = getTotals(
    items,
    getCouponDiscount(
      coupon,
      subtotal,
      shippingTotal
    ),
    shippingTotal,
    taxTotal
  );

  await updateCart(
    cart.id,
    cart.organization_id,
    {
      subtotal: totals.subtotal,
      discount_total:
        totals.discountTotal,
      shipping_total:
        totals.shippingTotal,
      tax_total: totals.taxTotal,
      total: totals.total,
      coupon_code:
        coupon?.code ?? null,
      updated_at: new Date().toISOString(),
    }
  );
  await createCartRealtimeEvent(
    cart.id,
    "cart_updated"
  );

  return totals;
}

export async function getCurrentCartId() {
  const cookieStore = await cookies();

  return (
    cookieStore.get(cartCookieName)
      ?.value ?? null
  );
}

export async function setCurrentCartId(
  cartId: string
) {
  const cookieStore = await cookies();

  cookieStore.set(
    cartCookieName,
    cartId,
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    }
  );
}

export async function getOrCreateCart() {
  const organizationId =
    getOrganizationId();
  const cartId =
    await getCurrentCartId();

  if (cartId) {
    const cart = await getCart(
      cartId,
      organizationId
    );

    if (cart) {
      return cart;
    }
  }

  const cart = await createCart({
    organization_id: organizationId,
  });

  await setCurrentCartId(cart.id);

  return cart;
}

export async function getCartDetail(): Promise<CatalogCartDetail | null> {
  const organizationId =
    getOrganizationId();
  const cartId =
    await getCurrentCartId();

  if (!cartId) {
    return null;
  }

  const cart = await getCart(
    cartId,
    organizationId
  );

  if (!cart) {
    return null;
  }

  const items = await getCartItems(
    cart.id,
    organizationId
  );
  const totals = await persistTotals(
    cart,
    items
  );

  return {
    cart,
    items,
    totals,
  };
}

export async function addCatalogCartItemFromForm(
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const cart =
    await getOrCreateCart();
  const productId = readText(
    formData,
    "product_id"
  );
  const variantId = readOptionalText(
    formData,
    "variant_id"
  );
  const quantity = readQuantity(formData);
  const notes = readOptionalText(
    formData,
    "notes"
  );
  const product =
    await getCatalogProductById(
      productId,
      organizationId
    );
  const variant = variantId
    ? await getVariant(
        variantId,
        organizationId
      )
    : null;
  const existing =
    await getCartItemByProduct(
      cart.id,
      product.id,
      variant?.id ?? null
    );
  const unitPrice =
    variant?.sale_price ??
    product.offer_price ??
    product.sale_price ??
    0;

  if (existing) {
    await updateCartItem(
      existing.id,
      organizationId,
      {
        quantity:
          existing.quantity + quantity,
        notes:
          notes ?? existing.notes,
        updated_at: new Date().toISOString(),
      }
    );
  } else {
    await createCartItem({
      organization_id: organizationId,
      cart_id: cart.id,
      product_id: product.id,
      variant_id: variant?.id ?? null,
      name: variant
        ? `${product.name} - ${variant.name}`
        : product.name,
      sku:
        variant?.sku ?? product.sku,
      image_url: product.image_url,
      quantity,
      unit_price: unitPrice,
      notes,
    });
  }

  const items = await getCartItems(
    cart.id,
    organizationId
  );

  await persistTotals(cart, items);
}

export async function updateCatalogCartItemFromForm(
  itemId: string,
  formData: FormData
) {
  const organizationId =
    getOrganizationId();
  const cart =
    await getOrCreateCart();

  await updateCartItem(
    itemId,
    organizationId,
    {
      quantity: readQuantity(formData),
      notes: readOptionalText(
        formData,
        "notes"
      ),
      updated_at: new Date().toISOString(),
    }
  );

  const items = await getCartItems(
    cart.id,
    organizationId
  );

  await persistTotals(cart, items);
}

export async function removeCatalogCartItem(
  itemId: string
) {
  const organizationId =
    getOrganizationId();
  const cart =
    await getOrCreateCart();

  await deleteCartItem(
    itemId,
    organizationId
  );

  const items = await getCartItems(
    cart.id,
    organizationId
  );

  await persistTotals(cart, items);
}

export async function applyCouponToCart(
  formData: FormData
) {
  const cart =
    await getOrCreateCart();
  const code = readText(
    formData,
    "coupon_code"
  );
  const items = await getCartItems(
    cart.id,
    cart.organization_id
  );
  const subtotal =
    getTotals(items).subtotal;
  const coupon =
    await getValidCouponByCode(
      cart.organization_id,
      code,
      subtotal,
      cart.customer_email ??
        (await getCurrentCustomerEmail())
    );

  if (!coupon) {
    throw new Error(
      "Cupon no valido."
    );
  }

  const updatedCart = await updateCart(
    cart.id,
    cart.organization_id,
    {
      coupon_code: coupon.code,
      updated_at: new Date().toISOString(),
    }
  );

  await persistTotals(
    updatedCart,
    items
  );
}

export async function removeCouponFromCart() {
  const cart =
    await getOrCreateCart();
  const items = await getCartItems(
    cart.id,
    cart.organization_id
  );
  const updatedCart = await updateCart(
    cart.id,
    cart.organization_id,
    {
      coupon_code: null,
      updated_at: new Date().toISOString(),
    }
  );

  await persistTotals(
    updatedCart,
    items
  );
}

export async function updateCheckoutFromForm(
  formData: FormData
) {
  const cart =
    await getOrCreateCart();

  await saveCustomerProfile(formData);

  const updatedCart = await updateCart(
    cart.id,
    cart.organization_id,
    {
      customer_name: readText(
        formData,
        "customer_name"
      ),
      customer_email: readText(
        formData,
        "customer_email"
      ),
      customer_phone: readText(
        formData,
        "customer_phone"
      ),
      shipping_address: readText(
        formData,
        "shipping_address"
      ),
      shipping_city: readText(
        formData,
        "shipping_city"
      ),
      shipping_notes: readOptionalText(
        formData,
        "shipping_notes"
      ),
      payment_method: readText(
        formData,
        "payment_method"
      ) || readText(
        formData,
        "method"
      ),
      updated_at: new Date().toISOString(),
    }
  );

  const items = await getCartItems(
    cart.id,
    cart.organization_id
  );

  await persistTotals(
    updatedCart,
    items
  );
}
