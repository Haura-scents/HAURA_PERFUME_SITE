import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  CheckoutForm,
  type ShippingPreview,
} from "@/components/commerce/CheckoutForm";
import { Container, SectionHeading } from "@/components/ui/Container";
import { getCart } from "@/lib/cart";
import { GIFT_WRAP_FEE_NGN } from "@/lib/shipping";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || cart.lines.length === 0) redirect("/cart");

  const admin = createAdminClient();
  const { data: rules } = await admin
    .from("shipping_rules")
    .select("region, free_over_ngn, flat_fee_ngn")
    .eq("active", true);

  const ng = rules?.find((r) => r.region === "NG");
  const intl = rules?.find((r) => r.region === "INTL");
  const preview: ShippingPreview = {
    ng_fee: ng?.flat_fee_ngn ?? 0,
    ng_free_over: ng?.free_over_ngn ?? null,
    intl_fee: intl?.flat_fee_ngn ?? 0,
    intl_free_over: intl?.free_over_ngn ?? null,
  };

  return (
    <Container className="py-14">
      <SectionHeading eyebrow="Secure" title="Checkout" />
      <div className="mt-10">
        <CheckoutForm
          subtotal={cart.subtotal_ngn}
          shippingPreview={preview}
          giftWrapFee={GIFT_WRAP_FEE_NGN}
        />
      </div>
    </Container>
  );
}
