"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import type { Variant } from "@/lib/catalog";

export function VariantPicker({ variants }: { variants: Variant[] }) {
  const router = useRouter();
  const sorted = [...variants].sort((a, b) => a.size_ml - b.size_ml);
  const [selectedId, setSelectedId] = useState(sorted[0]?.id);
  const [feedback, setFeedback] = useState<
    { kind: "added" | "error"; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();
  const selected = sorted.find((v) => v.id === selectedId);

  if (sorted.length === 0) {
    return (
      <p className="mt-8 text-sm text-on-dark-mute">Currently unavailable.</p>
    );
  }

  const outOfStock = selected !== undefined && selected.stock_qty === 0;

  function handleAdd() {
    if (!selected) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await addToCart(selected.id, 1);
      if (result.ok) {
        setFeedback({ kind: "added", message: "Added to your bag." });
        router.refresh();
      } else {
        setFeedback({ kind: "error", message: result.error });
      }
    });
  }

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
              onClick={() => {
                setSelectedId(variant.id);
                setFeedback(null);
              }}
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
        <Button
          size="lg"
          disabled={outOfStock || pending}
          onClick={handleAdd}
          className="w-full sm:w-auto sm:min-w-72"
        >
          {outOfStock ? "Out of Stock" : pending ? "Adding…" : "Add to Bag"}
        </Button>
        {feedback && (
          <p
            role="status"
            className={`mt-3 text-sm ${
              feedback.kind === "added" ? "text-success" : "text-danger"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}
