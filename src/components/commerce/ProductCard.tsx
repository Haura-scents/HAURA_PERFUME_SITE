import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/format";
import { minPrice, type ProductCard as ProductCardData } from "@/lib/catalog";
import { productImageUrl } from "@/lib/storage";

export function ProductCard({ product }: { product: ProductCardData }) {
  const price = minPrice(product);
  const image = product.product_images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-sm border border-ink-mute bg-ink-soft transition-colors hover:border-gold"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-ink-mute to-ink">
        {image ? (
          <Image
            src={productImageUrl(image.storage_path)}
            alt={image.alt_text || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder until product photography is uploaded */
          <div className="flex h-full items-center justify-center">
            <Image
              src="/brand/monogram.png"
              alt=""
              width={498}
              height={379}
              className="h-14 w-auto opacity-25"
            />
          </div>
        )}
        {product.is_new && (
          <div className="absolute left-3 top-3">
            <Badge>New</Badge>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-display text-lg text-champagne">{product.name}</h3>
        {product.subtitle && (
          <p className="mt-0.5 text-xs italic text-on-dark-mute">
            {product.subtitle}
          </p>
        )}
        {product.concentration && (
          <p className="text-eyebrow mt-2 text-on-dark-mute">
            {product.concentration}
          </p>
        )}
        {price !== null && (
          <p className="mt-2 text-sm text-gold">{formatNaira(price)}</p>
        )}
      </div>
    </Link>
  );
}
