import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";
import { formatNaira } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("order_number, status, total_ngn, contact_email")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) notFound();

  return (
    <Container className="py-24 text-center">
      <SectionHeading eyebrow="Thank You" title="Your order is placed" />
      <p className="mt-5 text-sm text-on-dark-mute">
        Order <span className="text-champagne">{order.order_number}</span> —{" "}
        {formatNaira(order.total_ngn)}
      </p>
      <p className="mt-2 text-sm text-on-dark-mute">
        A confirmation will be sent to{" "}
        <span className="text-champagne">{order.contact_email}</span> once
        payment is complete.
      </p>
      {order.status === "pending" && (
        <p className="mx-auto mt-6 max-w-md text-xs text-on-dark-mute">
          Online payment goes live in the payments build phase — this order is
          recorded as awaiting payment.
        </p>
      )}
      <ButtonLink href="/shop" className="mt-10">
        Continue Shopping
      </ButtonLink>
    </Container>
  );
}
