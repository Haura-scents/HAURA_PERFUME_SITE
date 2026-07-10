import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PageStub eyebrow="Our Story" title="The Art of Fine Fragrance" />;
}
