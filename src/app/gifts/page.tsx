import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Gifts" };

export default function GiftsPage() {
  return <PageStub eyebrow="Curated" title="The Gift of HAURA" />;
}
