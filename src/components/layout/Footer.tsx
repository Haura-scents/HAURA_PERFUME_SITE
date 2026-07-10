import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS } from "./nav-links";

const COLUMNS = [
  { title: "Shop", links: FOOTER_LINKS.shop },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Support", links: FOOTER_LINKS.support },
  { title: "Legal", links: FOOTER_LINKS.legal },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-mute bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div>
          <Image
            src="/brand/wordmark.png"
            alt="HAURA scent"
            width={960}
            height={417}
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-dark-mute">
            Exquisite compositions crafted with rare ingredients and a devotion
            to timeless elegance.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-eyebrow text-gold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-dark-mute transition-colors hover:text-champagne"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-mute py-5 text-center">
        <p className="text-xs text-on-dark-mute">
          © {new Date().getFullYear()} HAURA scent. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
