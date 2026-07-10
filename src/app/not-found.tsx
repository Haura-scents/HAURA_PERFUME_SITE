import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <SectionHeading eyebrow="404" title="This page has faded away" />
      <p className="mt-5 text-sm text-on-dark-mute">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <ButtonLink href="/" className="mt-9">
        Return Home
      </ButtonLink>
    </Container>
  );
}
