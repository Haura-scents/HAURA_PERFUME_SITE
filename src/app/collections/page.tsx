import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return <PageStub eyebrow="Curated" title="Collections" />;
}
