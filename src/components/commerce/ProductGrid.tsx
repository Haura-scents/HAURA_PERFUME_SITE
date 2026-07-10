import { ProductCard } from "./ProductCard";
import type { ProductCard as ProductCardData } from "@/lib/catalog";

export function ProductGrid({
  products,
  emptyMessage = "No fragrances found.",
}: {
  products: ProductCardData[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-on-dark-mute">
        {emptyMessage}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
