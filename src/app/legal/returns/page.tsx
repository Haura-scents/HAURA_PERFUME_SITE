import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Returns Policy" };

export default function ReturnsPage() {
  return (
    <PageStub
      eyebrow="Legal"
      title="Returns Policy"
      note="Full policy content arrives in the polish phase."
    />
  );
}
