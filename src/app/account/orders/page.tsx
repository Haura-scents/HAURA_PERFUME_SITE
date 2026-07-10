import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Order History" };

export default function OrdersPage() {
  return (
    <PageStub
      eyebrow="Members"
      title="Order History"
      note="Order history arrives with the accounts build phase."
    />
  );
}
