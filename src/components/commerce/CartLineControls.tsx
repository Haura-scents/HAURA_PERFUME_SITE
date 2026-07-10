"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateCartLine } from "@/app/actions/cart";

export function CartLineControls({
  lineId,
  quantity,
  maxQuantity,
}: {
  lineId: string;
  quantity: number;
  maxQuantity: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setQuantity(next: number) {
    setError(null);
    startTransition(async () => {
      const result = await updateCartLine(lineId, next);
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-ink-mute">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={pending}
            onClick={() => setQuantity(quantity - 1)}
            className="px-3 py-1.5 text-on-dark-mute transition-colors hover:text-champagne disabled:opacity-50"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm text-champagne">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={pending || quantity >= maxQuantity}
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1.5 text-on-dark-mute transition-colors hover:text-champagne disabled:opacity-50"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => setQuantity(0)}
          className="text-eyebrow text-on-dark-mute transition-colors hover:text-danger disabled:opacity-50"
        >
          Remove
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
