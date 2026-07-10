import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";

const TRUST_BADGES = [
  { title: "Complimentary Shipping", detail: "On qualifying orders" },
  { title: "Exclusive Samples", detail: "With every order" },
  { title: "Easy Returns", detail: "30-day return policy" },
  { title: "Secure Payments", detail: "Encrypted & trusted checkout" },
];

const CATEGORY_TILES = [
  { label: "Women", href: "/shop/women" },
  { label: "Men", href: "/shop/men" },
  { label: "Unisex", href: "/shop/unisex" },
  { label: "Discovery Sets", href: "/shop/discovery-sets" },
  { label: "Gifts", href: "/gifts" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-[#2b2115]">
        <Container className="grid min-h-[70vh] items-center gap-10 py-20 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow mb-5 text-gold">New Arrival</p>
            <h1 className="font-display text-5xl leading-tight text-cream-soft sm:text-6xl">
              Timeless by Nature.
              <br />
              <em className="text-champagne">Made to be Remembered.</em>
            </h1>
            <p className="mt-6 max-w-md text-on-dark-mute">
              Exquisite compositions crafted with rare ingredients and a
              devotion to timeless elegance.
            </p>
            <ButtonLink href="/shop" size="lg" className="mt-9">
              Discover the Collection →
            </ButtonLink>
          </div>
          {/* Placeholder for hero product photography */}
          <div
            className="mx-auto hidden aspect-[4/5] w-full max-w-sm rounded-sm bg-gradient-to-b from-gold/30 via-gold/10 to-transparent lg:block"
            aria-hidden
          />
        </Container>
      </section>

      {/* Trust badges */}
      <section className="border-y border-ink-mute bg-ink-soft">
        <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title}>
              <p className="text-eyebrow text-champagne">{badge.title}</p>
              <p className="mt-1 text-xs text-on-dark-mute">{badge.detail}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Category tiles */}
      <section className="py-14">
        <Container className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-sm border border-ink-mute bg-gradient-to-br from-ink-soft to-ink-mute p-5 transition-colors hover:border-gold"
            >
              <div>
                <span className="font-display text-xl text-champagne">
                  {tile.label}
                </span>
                <span className="text-eyebrow mt-1 block text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </Container>
      </section>

      {/* New arrivals / bestsellers placeholders — wired to live data in catalog phase */}
      <section className="pb-20">
        <Container>
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="The Edit" title="New Arrivals" />
            <Link href="/shop" className="text-eyebrow text-gold hover:text-gold-bright">
              View All
            </Link>
          </div>
          <p className="mt-6 text-sm text-on-dark-mute">
            Product grid coming online with the catalog.
          </p>
        </Container>
      </section>

      {/* Story */}
      <section className="border-t border-ink-mute bg-ink-soft py-20">
        <Container className="max-w-3xl text-center">
          <SectionHeading eyebrow="Our Story" title="The Art of Fine Fragrance" />
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-on-dark-mute">
            At HAURA scent, we believe perfume is more than a scent — it is an
            expression of who you are and how you wish to be remembered. Each
            creation is a tribute to nature&apos;s rarest ingredients and the
            timeless elegance that never fades.
          </p>
          <ButtonLink href="/about" variant="secondary" className="mt-9">
            Discover Our Story
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
