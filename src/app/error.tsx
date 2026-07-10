"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging/monitoring without exposing it to the user
    console.error(error);
  }, [error]);

  return (
    <Container className="py-28 text-center">
      <SectionHeading eyebrow="Something went wrong" title="A momentary lapse" />
      <p className="mt-5 text-sm text-on-dark-mute">
        We couldn&apos;t complete that request. Please try again — if the
        problem persists, we&apos;re already looking into it.
      </p>
      <div className="mt-9 flex items-center justify-center gap-4">
        <Button onClick={reset}>Try Again</Button>
        <ButtonLink href="/" variant="secondary">
          Return Home
        </ButtonLink>
      </div>
    </Container>
  );
}
