import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Container";
import { getProducts, type ShopSort } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop" };

const SORTS: { value: ShopSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: rawSort } = await searchParams;
  const sort: ShopSort = SORTS.some((s) => s.value === rawSort)
    ? (rawSort as ShopSort)
    : "newest";
  const products = await getProducts({ sort });

  return (
    <Container className="py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Shop" title="All Fragrances" />
        <nav aria-label="Sort" className="flex gap-4">
          {SORTS.map((s) => (
            <Link
              key={s.value}
              href={s.value === "newest" ? "/shop" : `/shop?sort=${s.value}`}
              className={`text-eyebrow transition-colors ${
                s.value === sort
                  ? "text-gold"
                  : "text-on-dark-mute hover:text-champagne"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-10">
        <ProductGrid
          products={products}
          emptyMessage="The collection is being prepared. Check back soon."
        />
      </div>
    </Container>
  );
}
