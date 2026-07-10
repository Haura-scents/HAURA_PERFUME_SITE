import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <PageStub
      eyebrow="Shop"
      title="All Fragrances"
      note="The full catalog arrives with the catalog build phase."
    />
  );
}
