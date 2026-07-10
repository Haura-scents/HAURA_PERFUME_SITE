/** Public URL for an image in the `product-images` storage bucket. */
export function productImageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
