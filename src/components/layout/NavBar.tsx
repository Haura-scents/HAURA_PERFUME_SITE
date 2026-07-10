"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "./nav-links";

export function NavBar({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-ink-mute">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="HAURA scent — home">
          <Image
            src="/brand/wordmark.png"
            alt="HAURA scent"
            width={960}
            height={417}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`text-eyebrow inline-flex items-center gap-1 py-2 transition-colors ${
                      active
                        ? "text-gold"
                        : "text-on-dark hover:text-gold-bright"
                    }`}
                  >
                    {link.label}
                    {link.children && <Chevron />}
                  </Link>
                  {link.children && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="min-w-44 border border-ink-mute bg-ink-soft py-2 shadow-xl">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-5 py-2 text-sm text-on-dark-mute transition-colors hover:bg-ink-mute hover:text-champagne"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/search"
            className="text-eyebrow hidden items-center gap-2 text-on-dark transition-colors hover:text-gold-bright sm:inline-flex"
          >
            <SearchIcon />
            <span className="hidden xl:inline">Search</span>
          </Link>
          <Link
            href="/account"
            className="text-eyebrow inline-flex items-center gap-2 text-on-dark transition-colors hover:text-gold-bright"
          >
            <UserIcon />
            <span className="hidden xl:inline">Account</span>
          </Link>
          <Link
            href="/cart"
            className="text-eyebrow relative inline-flex items-center gap-2 text-on-dark transition-colors hover:text-gold-bright"
          >
            <BagIcon />
            <span className="hidden xl:inline">Cart</span>
            {cartCount > 0 && (
              <span
                aria-label={`${cartCount} items in cart`}
                className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold text-ink"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="text-on-dark lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          className="border-t border-ink-mute bg-ink-soft lg:hidden"
          aria-label="Mobile"
        >
          <ul className="px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-ink-mute last:border-0">
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className="text-eyebrow block py-3.5 text-on-dark"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <ul className="pb-3 pl-4">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeMobile}
                          className="block py-2 text-sm text-on-dark-mute"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/search"
                onClick={closeMobile}
                className="text-eyebrow block py-3.5 text-on-dark"
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.5 17.5c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 6.5h12l-1 11H5l-1-11Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M7 8.5v-3a3 3 0 0 1 6 0v3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="m5 5 12 12M17 5 5 17" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
