import type { Metadata } from "next";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Container";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <Container className="py-14">
      <SectionHeading eyebrow="Find" title="Search" />
      <form action="/search" method="get" className="mt-8 max-w-xl">
        <div className="flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search fragrances, notes, collections…"
            aria-label="Search products"
            className="w-full rounded-full border border-ink-mute bg-ink-soft px-6 py-3 text-sm text-on-dark placeholder:text-on-dark-mute focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="text-eyebrow rounded-full bg-gradient-to-b from-gold-bright to-gold px-7 text-ink transition-all hover:from-champagne hover:to-gold-bright"
          >
            Search
          </button>
        </div>
      </form>
      <div className="mt-10">
        {q ? (
          <>
            <p className="mb-6 text-sm text-on-dark-mute">
              {results.length} {results.length === 1 ? "result" : "results"} for
              “{q}”
            </p>
            <ProductGrid
              products={results}
              emptyMessage="No fragrances match that search."
            />
          </>
        ) : (
          <p className="text-sm text-on-dark-mute">
            Search the collection by name, scent notes, or mood.
          </p>
        )}
      </div>
    </Container>
  );
}
