import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <PageStub
      eyebrow="Your Bag"
      title="Shopping Cart"
      note="Cart arrives with the cart & checkout build phase."
    />
  );
}
