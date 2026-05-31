-- Ready-to-sell listings + income ledger (per-user).
create table if not exists sell_listings (
  user_id text not null,
  id text not null,
  crop_id text not null,
  quantity_kg numeric,
  target_price numeric,
  status text default 'available',
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table sell_listings enable row level security;

create table if not exists incomes (
  user_id text not null,
  id text not null,
  income_date date not null,
  category text default 'harvest',
  amount numeric,
  description text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table incomes enable row level security;
