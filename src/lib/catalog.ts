import { createClient } from "@/lib/supabase/server";

export type Variant = {
  id: string;
  size_ml: number;
  price_ngn: number;
  stock_qty: number;
};

export type ProductImage = {
  storage_path: string;
  alt_text: string;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  concentration: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  product_variants: Variant[];
  product_images: ProductImage[];
};

export type ProductDetail = ProductCard & {
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  categories: { slug: string; name: string } | null;
  collections: { slug: string; name: string } | null;
};

const CARD_SELECT =
  "id, slug, name, subtitle, concentration, is_new, is_bestseller, product_variants(id, size_ml, price_ngn, stock_qty), product_images(storage_path, alt_text)";

export function minPrice(p: ProductCard): number | null {
  if (p.product_variants.length === 0) return null;
  return Math.min(...p.product_variants.map((v) => v.price_ngn));
}

export type ShopSort = "newest" | "price-asc" | "price-desc";

export async function getProducts(opts?: {
  categorySlug?: string;
  sort?: ShopSort;
  onlyNew?: boolean;
  onlyBestsellers?: boolean;
  limit?: number;
}): Promise<ProductCard[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(CARD_SELECT);

  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .single();
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  }
  if (opts?.onlyNew) query = query.eq("is_new", true);
  if (opts?.onlyBestsellers) query = query.eq("is_bestseller", true);
  query = query.order("created_at", { ascending: false });
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  const products = (data ?? []) as ProductCard[];

  // Price sorts operate on the cheapest variant, computed app-side
  if (opts?.sort === "price-asc" || opts?.sort === "price-desc") {
    const dir = opts.sort === "price-asc" ? 1 : -1;
    products.sort(
      (a, b) => ((minPrice(a) ?? 0) - (minPrice(b) ?? 0)) * dir
    );
  }
  return products;
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${CARD_SELECT}, description, notes, categories(slug, name), collections(slug, name)`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data as ProductDetail | null;
}

export async function searchProducts(term: string): Promise<ProductCard[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(CARD_SELECT)
    .textSearch("search_tsv", trimmed, { type: "websearch" })
    .limit(24);
  if (error) throw new Error(`Search failed: ${error.message}`);
  return (data ?? []) as ProductCard[];
}

export async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("slug, name, description")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}
