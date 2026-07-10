import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { VariantPicker } from "@/components/commerce/VariantPicker";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { productImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Fragrance",
    description: product?.description.slice(0, 160),
  };
}

const NOTE_SECTIONS = [
  { key: "top", label: "Top Notes" },
  { key: "heart", label: "Heart Notes" },
  { key: "base", label: "Base Notes" },
] as const;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (
    await getProducts({
      categorySlug: product.categories?.slug,
      limit: 5,
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const image = product.product_images[0];
  const hasNotes = NOTE_SECTIONS.some(
    (s) => (product.notes[s.key] ?? []).length > 0
  );

  return (
    <Container className="py-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-on-dark-mute">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-champagne">Home</Link>
            <span className="ml-2">›</span>
          </li>
          {product.categories && (
            <li>
              <Link
                href={`/shop/${product.categories.slug}`}
                className="hover:text-champagne"
              >
                {product.categories.name}
              </Link>
              <span className="ml-2">›</span>
            </li>
          )}
          <li aria-current="page" className="text-champagne">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-ink-mute bg-gradient-to-b from-ink-mute to-ink">
          {image ? (
            <Image
              src={productImageUrl(image.storage_path)}
              alt={image.alt_text || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image
                src="/brand/monogram.png"
                alt=""
                width={498}
                height={379}
                className="h-24 w-auto opacity-25"
              />
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.collections && (
            <p className="text-eyebrow text-gold">
              {product.collections.name}
            </p>
          )}
          <h1 className="font-display mt-3 text-4xl text-cream-soft sm:text-5xl">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="font-display mt-1 text-2xl italic text-champagne">
              {product.subtitle}
            </p>
          )}
          {product.concentration && (
            <p className="text-eyebrow mt-4 text-on-dark-mute">
              {product.concentration}
            </p>
          )}
          {product.description && (
            <p className="mt-6 max-w-lg leading-relaxed text-on-dark-mute">
              {product.description}
            </p>
          )}

          <VariantPicker variants={product.product_variants} />

          <p className="text-eyebrow mt-6 text-on-dark-mute">
            Complimentary shipping &amp; returns on qualifying orders
          </p>
        </div>
      </div>

      {/* Scent notes */}
      {hasNotes && (
        <section className="mt-14 rounded-sm border border-ink-mute bg-ink-soft p-8">
          <h2 className="text-eyebrow text-gold">Scent Notes</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {NOTE_SECTIONS.map((section) => {
              const notes = product.notes[section.key] ?? [];
              if (notes.length === 0) return null;
              return (
                <div key={section.key}>
                  <h3 className="text-eyebrow text-champagne">
                    {section.label}
                  </h3>
                  <p className="mt-2 text-sm text-on-dark-mute">
                    {notes.join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-champagne">
            You May Also Love
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </Container>
  );
}
