-- HAURA scent — initial schema
-- Applied via psql; kept in-repo as the source of truth for the database shape.

create extension if not exists "pgcrypto";

-- ============ profiles (extends auth.users) ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  marketing_opt_in boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ catalog ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  position int not null default 0
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  hero_image text,
  published boolean not null default false
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text,
  description text not null default '',
  concentration text, -- e.g. 'Eau de Parfum', 'Extrait de Parfum'
  category_id uuid references public.categories (id) on delete set null,
  collection_id uuid references public.collections (id) on delete set null,
  notes jsonb not null default '{"top":[],"heart":[],"base":[]}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size_ml int not null,
  price_ngn integer not null check (price_ngn >= 0), -- whole naira
  sku text not null unique,
  stock_qty int not null default 0 check (stock_qty >= 0),
  position int not null default 0,
  unique (product_id, size_ml)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  position int not null default 0
);

-- ============ carts ============
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  guest_token uuid, -- set for guest carts, cookie-held
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_token is not null)
);
create unique index carts_user_unique on public.carts (user_id) where user_id is not null;
create unique index carts_guest_unique on public.carts (guest_token) where guest_token is not null;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  unique (cart_id, variant_id)
);

-- ============ addresses ============
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text,
  country_code text not null default 'NG',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ orders ============
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  guest_email text, -- for guest checkout
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal_ngn integer not null,
  shipping_ngn integer not null default 0,
  total_ngn integer not null,
  shipping_address jsonb not null, -- snapshot at order time
  contact_email text not null,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_email is not null)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  -- snapshots so history survives catalog edits
  product_name text not null,
  size_ml int not null,
  unit_price_ngn integer not null,
  quantity int not null check (quantity > 0),
  gift_wrap boolean not null default false,
  gift_note text
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null check (provider in ('paystack', 'stripe')),
  provider_ref text not null unique, -- idempotency key from webhook
  status text not null default 'initiated'
    check (status in ('initiated', 'succeeded', 'failed', 'refunded')),
  amount integer not null,
  currency text not null default 'NGN',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ reviews ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

-- ============ wishlists ============
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ============ shipping & discounts ============
create table public.shipping_rules (
  id uuid primary key default gen_random_uuid(),
  region text not null unique, -- 'NG' | 'INTL' to start
  free_over_ngn integer, -- null = never free
  flat_fee_ngn integer not null,
  active boolean not null default true
);

create table public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off int check (percent_off between 1 and 100),
  amount_off_ngn integer,
  starts_at timestamptz,
  ends_at timestamptz,
  max_uses int,
  used_count int not null default 0,
  active boolean not null default true,
  check (percent_off is not null or amount_off_ngn is not null)
);

-- ============ content (Discover / blog) ============
create table public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null default '', -- markdown
  hero_image text,
  published_at timestamptz, -- null = draft
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ FX display rates ============
create table public.fx_rates (
  currency text primary key, -- 'USD', 'EUR', 'GBP'
  rate_per_ngn numeric not null, -- 1 NGN -> X currency
  fetched_at timestamptz not null default now()
);

-- ============ search ============
alter table public.products add column search_tsv tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index products_search_idx on public.products using gin (search_tsv);

-- ============ triggers ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();
create trigger orders_updated before update on public.orders
  for each row execute function public.set_updated_at();
create trigger payments_updated before update on public.payments
  for each row execute function public.set_updated_at();
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger carts_updated before update on public.carts
  for each row execute function public.set_updated_at();
create trigger content_updated before update on public.content_pages
  for each row execute function public.set_updated_at();

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.phone);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ row level security ============
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.shipping_rules enable row level security;
alter table public.discount_codes enable row level security;
alter table public.content_pages enable row level security;
alter table public.fx_rates enable row level security;

-- Public catalog: anyone can read published/active data
create policy "catalog read" on public.categories for select using (true);
create policy "collections read" on public.collections for select using (published);
create policy "products read" on public.products for select using (status = 'published');
create policy "variants read" on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "images read" on public.product_images for select
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "shipping read" on public.shipping_rules for select using (active);
create policy "content read" on public.content_pages for select using (published_at is not null);
create policy "fx read" on public.fx_rates for select using (true);
create policy "approved reviews read" on public.reviews for select using (status = 'approved');

-- Own data
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own addresses" on public.addresses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own orders read" on public.orders for select using (auth.uid() = user_id);
create policy "own order items read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "own order history read" on public.order_status_history for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create policy "own reviews write" on public.reviews for insert with check (auth.uid() = user_id);
create policy "own reviews read" on public.reviews for select using (auth.uid() = user_id);

create policy "own wishlist" on public.wishlist_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own cart" on public.carts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cart items" on public.cart_items for all
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- Note: guest carts, order creation, payments, stock, admin writes all go
-- through server-side code using the service-role key, which bypasses RLS.

-- ============ seed data ============
insert into public.categories (slug, name, position) values
  ('women', 'Women', 1),
  ('men', 'Men', 2),
  ('unisex', 'Unisex', 3),
  ('discovery-sets', 'Discovery Sets', 4),
  ('gifts', 'Gifts', 5);

insert into public.shipping_rules (region, free_over_ngn, flat_fee_ngn) values
  ('NG', 150000, 3500),
  ('INTL', 500000, 45000);
