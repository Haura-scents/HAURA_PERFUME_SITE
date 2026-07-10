"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateCartId, findCartId } from "@/lib/cart";
import { createAdminClient } from "@/lib/supabase/admin";

export type CartActionResult = { ok: true } | { ok: false; error: string };

const addSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
});

export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<CartActionResult> {
  const parsed = addSchema.safeParse({ variantId, quantity });
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const admin = createAdminClient();

  // Validate the variant exists, is purchasable, and has stock
  const { data: variant } = await admin
    .from("product_variants")
    .select("id, stock_qty, products(status)")
    .eq("id", parsed.data.variantId)
    .maybeSingle();
  const status = (variant?.products as unknown as { status: string } | null)
    ?.status;
  if (!variant || status !== "published")
    return { ok: false, error: "This fragrance is unavailable." };

  const cartId = await getOrCreateCartId();

  const { data: existing } = await admin
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("variant_id", variant.id)
    .maybeSingle();

  const newQty = (existing?.quantity ?? 0) + parsed.data.quantity;
  if (newQty > variant.stock_qty)
    return { ok: false, error: "Not enough stock available." };

  const { error } = existing
    ? await admin
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id)
    : await admin
        .from("cart_items")
        .insert({ cart_id: cartId, variant_id: variant.id, quantity: newQty });
  if (error) return { ok: false, error: "Could not update cart." };

  revalidatePath("/", "layout");
  return { ok: true };
}

const updateSchema = z.object({
  lineId: z.string().uuid(),
  quantity: z.number().int().min(0).max(20),
});

export async function updateCartLine(
  lineId: string,
  quantity: number
): Promise<CartActionResult> {
  const parsed = updateSchema.safeParse({ lineId, quantity });
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const cartId = await findCartId();
  if (!cartId) return { ok: false, error: "Cart not found." };

  const admin = createAdminClient();

  if (parsed.data.quantity === 0) {
    const { error } = await admin
      .from("cart_items")
      .delete()
      .eq("id", parsed.data.lineId)
      .eq("cart_id", cartId); // scoped to the caller's own cart
    if (error) return { ok: false, error: "Could not remove item." };
  } else {
    const { data: line } = await admin
      .from("cart_items")
      .select("id, product_variants(stock_qty)")
      .eq("id", parsed.data.lineId)
      .eq("cart_id", cartId)
      .maybeSingle();
    if (!line) return { ok: false, error: "Item not found." };
    const stock =
      (line.product_variants as unknown as { stock_qty: number } | null)
        ?.stock_qty ?? 0;
    if (parsed.data.quantity > stock)
      return { ok: false, error: "Not enough stock available." };

    const { error } = await admin
      .from("cart_items")
      .update({ quantity: parsed.data.quantity })
      .eq("id", parsed.data.lineId)
      .eq("cart_id", cartId);
    if (error) return { ok: false, error: "Could not update quantity." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
