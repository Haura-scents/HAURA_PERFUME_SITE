import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CartLineControls } from "@/components/commerce/CartLineControls";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";
import { getCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { productImageUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const cart = await getCart();
  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <Container className="py-14">
      <SectionHeading eyebrow="Your Bag" title="Shopping Cart" />

      {isEmpty ? (
        <div className="py-16 text-center">
          <p className="text-sm text-on-dark-mute">Your bag is empty.</p>
          <ButtonLink href="/shop" className="mt-8">
            Discover the Collection
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-ink-mute border-y border-ink-mute">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex gap-5 py-6">
                <Link
                  href={`/product/${line.variant.product.slug}`}
                  className="relative block h-28 w-24 shrink-0 overflow-hidden rounded-sm border border-ink-mute bg-gradient-to-b from-ink-mute to-ink"
                >
                  {line.variant.product.image_path ? (
                    <Image
                      src={productImageUrl(line.variant.product.image_path)}
                      alt={line.variant.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center">
                      <Image
                        src="/brand/monogram.png"
                        alt=""
                        width={498}
                        height={379}
                        className="h-8 w-auto opacity-25"
                      />
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${line.variant.product.slug}`}
                      className="font-display text-lg text-champagne hover:text-gold-bright"
                    >
                      {line.variant.product.name}
                    </Link>
                    {line.variant.product.subtitle && (
                      <p className="text-xs italic text-on-dark-mute">
                        {line.variant.product.subtitle}
                      </p>
                    )}
                    <p className="text-eyebrow mt-2 text-on-dark-mute">
                      {line.variant.size_ml} ml
                    </p>
                    <div className="mt-3">
                      <CartLineControls
                        lineId={line.id}
                        quantity={line.quantity}
                        maxQuantity={Math.min(line.variant.stock_qty, 20)}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gold">
                    {formatNaira(line.variant.price_ngn * line.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-sm border border-ink-mute bg-ink-soft p-6">
            <h2 className="text-eyebrow text-gold">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-on-dark-mute">
                  Subtotal ({cart.item_count}{" "}
                  {cart.item_count === 1 ? "item" : "items"})
                </dt>
                <dd className="text-champagne">
                  {formatNaira(cart.subtotal_ngn)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-dark-mute">Shipping</dt>
                <dd className="text-on-dark-mute">Calculated at checkout</dd>
              </div>
            </dl>
            <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
              Proceed to Checkout
            </ButtonLink>
            <p className="mt-4 text-center text-xs text-on-dark-mute">
              Secure, encrypted checkout
            </p>
          </aside>
        </div>
      )}
    </Container>
  );
}
