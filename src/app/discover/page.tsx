import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return <PageStub eyebrow="Journal" title="Discover" />;
}
