import type { ReactNode } from "react";

type Tone = "gold" | "neutral" | "success" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  gold: "bg-gold text-ink",
  neutral: "bg-ink-mute text-champagne",
  success: "bg-success text-cream-soft",
  danger: "bg-danger text-cream-soft",
};

export function Badge({
  tone = "gold",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`text-eyebrow inline-block rounded-full px-3 py-1 ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
