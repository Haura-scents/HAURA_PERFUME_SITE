import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const GUEST_CART_COOKIE = "haura_cart";

export type CartLine = {
  id: string;
  quantity: number;
  variant: {
    id: string;
    size_ml: number;
    price_ngn: number;
    stock_qty: number;
    product: {
      slug: string;
      name: string;
      subtitle: string | null;
      image_path: string | null;
    };
  };
};

export type CartView = {
  id: string;
  lines: CartLine[];
  subtotal_ngn: number;
  item_count: number;
};

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Find the current cart (logged-in user's, or guest cookie's) without creating one. */
export async function findCartId(): Promise<string | null> {
  const admin = createAdminClient();
  const userId = await currentUserId();
  if (userId) {
    const { data } = await admin
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return data.id;
  }
  const guestToken = (await cookies()).get(GUEST_CART_COOKIE)?.value;
  if (guestToken) {
    const { data } = await admin
      .from("carts")
      .select("id")
      .eq("guest_token", guestToken)
      .maybeSingle();
    if (data) return data.id;
  }
  return null;
}

/** Find or create a cart. Only call from Server Actions (writes a cookie for guests). */
export async function getOrCreateCartId(): Promise<string> {
  const existing = await findCartId();
  if (existing) return existing;

  const admin = createAdminClient();
  const userId = await currentUserId();

  if (userId) {
    const { data, error } = await admin
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (error) throw new Error(`Could not create cart: ${error.message}`);
    return data.id;
  }

  const guestToken = crypto.randomUUID();
  const { data, error } = await admin
    .from("carts")
    .insert({ guest_token: guestToken })
    .select("id")
    .single();
  if (error) throw new Error(`Could not create cart: ${error.message}`);

  (await cookies()).set(GUEST_CART_COOKIE, guestToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
  });
  return data.id;
}

export async function getCart(): Promise<CartView | null> {
  const cartId = await findCartId();
  if (!cartId) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cart_items")
    .select(
      `id, quantity,
       product_variants (
         id, size_ml, price_ngn, stock_qty,
         products ( slug, name, subtitle, status, product_images ( storage_path, position ) )
       )`
    )
    .eq("cart_id", cartId);
  if (error) throw new Error(`Could not load cart: ${error.message}`);

  type Row = {
    id: string;
    quantity: number;
    product_variants: {
      id: string;
      size_ml: number;
      price_ngn: number;
      stock_qty: number;
      products: {
        slug: string;
        name: string;
        subtitle: string | null;
        status: string;
        product_images: { storage_path: string; position: number }[];
      };
    } | null;
  };

  const lines: CartLine[] = ((data ?? []) as unknown as Row[])
    .filter((r) => r.product_variants && r.product_variants.products.status === "published")
    .map((r) => {
      const v = r.product_variants!;
      const images = [...v.products.product_images].sort(
        (a, b) => a.position - b.position
      );
      return {
        id: r.id,
        quantity: r.quantity,
        variant: {
          id: v.id,
          size_ml: v.size_ml,
          price_ngn: v.price_ngn,
          stock_qty: v.stock_qty,
          product: {
            slug: v.products.slug,
            name: v.products.name,
            subtitle: v.products.subtitle,
            image_path: images[0]?.storage_path ?? null,
          },
        },
      };
    });

  const subtotal = lines.reduce(
    (sum, l) => sum + l.quantity * l.variant.price_ngn,
    0
  );
  return {
    id: cartId,
    lines,
    subtotal_ngn: subtotal,
    item_count: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart?.item_count ?? 0;
}
