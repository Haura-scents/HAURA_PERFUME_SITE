import { Container, SectionHeading } from "@/components/ui/Container";

/** Temporary placeholder for routes whose build phase hasn't landed yet. */
export function PageStub({
  eyebrow,
  title,
  note = "This page is under construction.",
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <Container className="py-24 text-center">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <p className="mt-5 text-sm text-on-dark-mute">{note}</p>
    </Container>
  );
}
