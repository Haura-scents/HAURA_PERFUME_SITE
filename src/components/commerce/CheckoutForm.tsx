"use client";

import { useActionState, useState } from "react";
import { placeOrder, type CheckoutState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { formatNaira } from "@/lib/format";

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "AE", name: "United Arab Emirates" },
];

export type ShippingPreview = {
  ng_fee: number;
  ng_free_over: number | null;
  intl_fee: number;
  intl_free_over: number | null;
};

export function CheckoutForm({
  subtotal,
  shippingPreview,
  giftWrapFee,
}: {
  subtotal: number;
  shippingPreview: ShippingPreview;
  giftWrapFee: number;
}) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    null
  );
  const [country, setCountry] = useState("NG");
  const [giftWrap, setGiftWrap] = useState(false);

  const isNg = country === "NG";
  const freeOver = isNg
    ? shippingPreview.ng_free_over
    : shippingPreview.intl_free_over;
  const baseFee = isNg ? shippingPreview.ng_fee : shippingPreview.intl_fee;
  const shippingFee = freeOver !== null && subtotal >= freeOver ? 0 : baseFee;
  const giftFee = giftWrap ? giftWrapFee : 0;
  const total = subtotal + shippingFee + giftFee;
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section>
          <h2 className="text-eyebrow text-gold">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Email" name="email" type="email" required error={errors.email} />
            <Input label="Phone" name="phone" type="tel" required error={errors.phone} />
          </div>
        </section>

        <section>
          <h2 className="text-eyebrow text-gold">Shipping Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Recipient Name"
              name="recipient_name"
              required
              className="sm:col-span-2"
              error={errors.recipient_name}
            />
            <Input
              label="Address Line 1"
              name="line1"
              required
              className="sm:col-span-2"
              error={errors.line1}
            />
            <Input
              label="Address Line 2 (optional)"
              name="line2"
              className="sm:col-span-2"
              error={errors.line2}
            />
            <Input label="City" name="city" required error={errors.city} />
            <Input label="State / Region" name="state" required error={errors.state} />
            <Input
              label="Postal Code (optional)"
              name="postal_code"
              error={errors.postal_code}
            />
            <Select
              label="Country"
              name="country_code"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={errors.country_code}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <section>
          <h2 className="text-eyebrow text-gold">Gift Options</h2>
          <label className="mt-4 flex items-center gap-3 text-sm text-on-dark">
            <input
              type="checkbox"
              name="gift_wrap"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="h-4 w-4 accent-[#c9a86a]"
            />
            Add signature gift wrap (+{formatNaira(giftWrapFee)})
          </label>
          {giftWrap && (
            <div className="mt-4">
              <Textarea
                label="Personal Note (optional)"
                name="gift_note"
                placeholder="Write a message to accompany the gift…"
                error={errors.gift_note}
              />
            </div>
          )}
        </section>
      </div>

      <aside className="h-fit rounded-sm border border-ink-mute bg-ink-soft p-6">
        <h2 className="text-eyebrow text-gold">Order Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-on-dark-mute">Subtotal</dt>
            <dd className="text-champagne">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-on-dark-mute">Shipping ({isNg ? "Nigeria" : "International"})</dt>
            <dd className={shippingFee === 0 ? "text-success" : "text-champagne"}>
              {shippingFee === 0 ? "Complimentary" : formatNaira(shippingFee)}
            </dd>
          </div>
          {giftWrap && (
            <div className="flex justify-between">
              <dt className="text-on-dark-mute">Gift Wrap</dt>
              <dd className="text-champagne">{formatNaira(giftFee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-ink-mute pt-3">
            <dt className="text-champagne">Total</dt>
            <dd className="font-display text-xl text-cream-soft">
              {formatNaira(total)}
            </dd>
          </div>
        </dl>
        {freeOver !== null && shippingFee > 0 && (
          <p className="mt-3 text-xs text-on-dark-mute">
            Complimentary shipping on orders over {formatNaira(freeOver)}.
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending} className="mt-7 w-full">
          {pending ? "Placing Order…" : "Continue to Payment"}
        </Button>
        {state?.formError && (
          <p role="alert" className="mt-4 text-sm text-danger">
            {state.formError}
          </p>
        )}
        <p className="mt-4 text-center text-xs text-on-dark-mute">
          Payment is confirmed on the next step. Nothing is charged yet.
        </p>
      </aside>
    </form>
  );
}
