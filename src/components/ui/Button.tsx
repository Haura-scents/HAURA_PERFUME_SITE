import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-gold-bright to-gold text-ink hover:from-champagne hover:to-gold-bright",
  secondary:
    "border border-gold text-gold hover:bg-gold hover:text-ink",
  ghost: "text-champagne hover:text-gold-bright",
  danger: "bg-danger text-cream-soft hover:opacity-90",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.68rem]",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

const BASE_CLASSES =
  "text-eyebrow inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
