import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <PageStub
      eyebrow="Members"
      title="My Account"
      note="Accounts arrive with the accounts build phase."
    />
  );
}
