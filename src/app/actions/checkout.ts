"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCart } from "@/lib/cart";
import { getShippingQuote, GIFT_WRAP_FEE_NGN } from "@/lib/shipping";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number.").max(20),
  recipient_name: z.string().min(2, "Enter the recipient's full name."),
  line1: z.string().min(3, "Enter a street address."),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter a city."),
  state: z.string().min(2, "Enter a state or region."),
  postal_code: z.string().optional(),
  country_code: z.string().length(2),
  gift_wrap: z.boolean(),
  gift_note: z.string().max(300, "Keep the note under 300 characters.").optional(),
});

export type CheckoutState = {
  errors?: Record<string, string>;
  formError?: string;
} | null;

function newOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HAU-${stamp}-${rand}`;
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    recipient_name: formData.get("recipient_name"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postal_code: formData.get("postal_code") || undefined,
    country_code: formData.get("country_code"),
    gift_wrap: formData.get("gift_wrap") === "on",
    gift_note: formData.get("gift_note") || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { errors };
  }
  const form = parsed.data;

  // Re-read the cart server-side — prices and stock come from the DB, never the client
  const cart = await getCart();
  if (!cart || cart.lines.length === 0)
    return { formError: "Your bag is empty." };

  for (const line of cart.lines) {
    if (line.quantity > line.variant.stock_qty)
      return {
        formError: `Not enough stock of ${line.variant.product.name} (${line.variant.size_ml} ml). Please adjust your bag.`,
      };
  }

  const shipping = await getShippingQuote(cart.subtotal_ngn, form.country_code);
  const giftFee = form.gift_wrap ? GIFT_WRAP_FEE_NGN : 0;
  const total = cart.subtotal_ngn + shipping.fee_ngn + giftFee;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const orderNumber = newOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: user ? null : form.email,
      status: "pending",
      subtotal_ngn: cart.subtotal_ngn,
      shipping_ngn: shipping.fee_ngn,
      gift_wrap: form.gift_wrap,
      gift_note: form.gift_note ?? null,
      gift_wrap_fee_ngn: giftFee,
      total_ngn: total,
      contact_email: form.email,
      contact_phone: form.phone,
      shipping_address: {
        recipient_name: form.recipient_name,
        line1: form.line1,
        line2: form.line2 ?? null,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code ?? null,
        country_code: form.country_code,
      },
    })
    .select("id")
    .single();
  if (orderError)
    return { formError: "Could not create your order. Please try again." };

  const { error: itemsError } = await admin.from("order_items").insert(
    cart.lines.map((line) => ({
      order_id: order.id,
      variant_id: line.variant.id,
      product_name: `${line.variant.product.name}${
        line.variant.product.subtitle ? ` ${line.variant.product.subtitle}` : ""
      }`,
      size_ml: line.variant.size_ml,
      unit_price_ngn: line.variant.price_ngn,
      quantity: line.quantity,
    }))
  );
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { formError: "Could not create your order. Please try again." };
  }

  await admin.from("order_status_history").insert({
    order_id: order.id,
    status: "pending",
    note: "Order placed, awaiting payment.",
  });

  // Empty the cart; stock is decremented when payment confirms (webhook phase)
  await admin.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/", "layout");
  redirect(`/checkout/success?order=${orderNumber}`);
}
