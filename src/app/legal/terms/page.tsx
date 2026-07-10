import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PageStub
      eyebrow="Legal"
      title="Terms of Service"
      note="Full policy content arrives in the polish phase."
    />
  );
}
