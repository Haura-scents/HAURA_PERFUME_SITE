import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <PageStub
      eyebrow="Secure"
      title="Checkout"
      note="Checkout arrives with the cart & checkout build phase."
    />
  );
}
