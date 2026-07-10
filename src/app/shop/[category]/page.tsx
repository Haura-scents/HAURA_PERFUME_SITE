import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageStub } from "@/components/ui/PageStub";

const CATEGORIES: Record<string, string> = {
  women: "Women",
  men: "Men",
  unisex: "Unisex",
  "discovery-sets": "Discovery Sets",
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: CATEGORIES[category] ?? "Shop" };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const label = CATEGORIES[category];
  if (!label) notFound();

  return (
    <PageStub
      eyebrow="Shop"
      title={label}
      note="Products for this category arrive with the catalog build phase."
    />
  );
}
