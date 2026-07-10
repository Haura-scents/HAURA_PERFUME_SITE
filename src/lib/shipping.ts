import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** Flat gift-wrap fee; make admin-configurable later if it needs to vary. */
export const GIFT_WRAP_FEE_NGN = 5000;

export type ShippingQuote = {
  region: "NG" | "INTL";
  fee_ngn: number;
  free_over_ngn: number | null;
  is_free: boolean;
};

export async function getShippingQuote(
  subtotalNgn: number,
  countryCode: string
): Promise<ShippingQuote> {
  const region = countryCode === "NG" ? "NG" : "INTL";
  const admin = createAdminClient();
  const { data: rule, error } = await admin
    .from("shipping_rules")
    .select("free_over_ngn, flat_fee_ngn")
    .eq("region", region)
    .eq("active", true)
    .maybeSingle();
  if (error || !rule)
    throw new Error(`No active shipping rule for region ${region}`);

  const isFree =
    rule.free_over_ngn !== null && subtotalNgn >= rule.free_over_ngn;
  return {
    region,
    fee_ngn: isFree ? 0 : rule.flat_fee_ngn,
    free_over_ngn: rule.free_over_ngn,
    is_free: isFree,
  };
}
