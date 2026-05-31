-- Per-user market prices (entered manually from official sources like
-- SIT Kosova / ASK). Falls back to in-app sample data when empty.
create table if not exists market_prices (
  user_id text not null,
  crop_id text not null,
  price_eur_kg numeric,
  prev_price numeric,
  price_date date default now(),
  primary key (user_id, crop_id)
);
alter table market_prices enable row level security;
