import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PageStub
      eyebrow="Legal"
      title="Privacy Policy"
      note="Full policy content arrives in the polish phase."
    />
  );
}
