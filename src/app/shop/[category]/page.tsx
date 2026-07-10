import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Container";
import { getCategory, getProducts } from "@/lib/catalog";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  return { title: cat?.name ?? "Shop" };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const products = await getProducts({ categorySlug: cat.slug });

  return (
    <Container className="py-14">
      <SectionHeading eyebrow="Shop" title={cat.name} />
      {cat.description && (
        <p className="mt-4 max-w-xl text-sm text-on-dark-mute">
          {cat.description}
        </p>
      )}
      <div className="mt-10">
        <ProductGrid
          products={products}
          emptyMessage="Nothing here yet — this collection is being prepared."
        />
      </div>
    </Container>
  );
}
