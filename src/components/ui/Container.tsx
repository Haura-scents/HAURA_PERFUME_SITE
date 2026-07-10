import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-eyebrow mb-3 text-gold">{eyebrow}</p>}
      <h2 className="font-display text-3xl text-champagne sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
