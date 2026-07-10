import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <PageStub
      eyebrow="Find"
      title="Search"
      note="Product search arrives with the catalog build phase."
    />
  );
}
