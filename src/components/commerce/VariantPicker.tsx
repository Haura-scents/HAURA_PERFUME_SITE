"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import type { Variant } from "@/lib/catalog";

/** Size selection + price + add-to-bag. The add-to-bag action is wired to the
 *  cart in the cart & checkout phase; until then it's disabled with a note. */
export function VariantPicker({ variants }: { variants: Variant[] }) {
  const sorted = [...variants].sort((a, b) => a.size_ml - b.size_ml);
  const [selectedId, setSelectedId] = useState(sorted[0]?.id);
  const selected = sorted.find((v) => v.id === selectedId);

  if (sorted.length === 0) {
    return (
      <p className="mt-8 text-sm text-on-dark-mute">
        Currently unavailable.
      </p>
    );
  }

  const outOfStock = selected !== undefined && selected.stock_qty === 0;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-6">
        {selected && (
          <p className="font-display text-3xl text-cream-soft">
            {formatNaira(selected.price_ngn)}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-eyebrow mr-1 text-on-dark-mute">Size:</span>
          {sorted.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setSelectedId(variant.id)}
              aria-pressed={variant.id === selectedId}
              className={`text-eyebrow rounded-full border px-4 py-2 transition-colors ${
                variant.id === selectedId
                  ? "border-gold bg-gold text-ink"
                  : "border-ink-mute text-on-dark-mute hover:border-gold hover:text-champagne"
              }`}
            >
              {variant.size_ml} ml
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button size="lg" disabled className="w-full sm:w-auto sm:min-w-72">
          {outOfStock ? "Out of Stock" : "Add to Bag"}
        </Button>
        {!outOfStock && (
          <p className="mt-2 text-xs text-on-dark-mute">
            Cart opens in the next build phase.
          </p>
        )}
      </div>
    </div>
  );
}
