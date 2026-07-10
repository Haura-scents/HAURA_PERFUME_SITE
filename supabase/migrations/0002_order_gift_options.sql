-- Gift options apply to the whole order (single parcel), not per line item.
alter table public.orders
  add column gift_wrap boolean not null default false,
  add column gift_note text,
  add column gift_wrap_fee_ngn integer not null default 0;

-- The per-item columns from 0001 are superseded by the order-level ones.
alter table public.order_items
  drop column gift_wrap,
  drop column gift_note;
