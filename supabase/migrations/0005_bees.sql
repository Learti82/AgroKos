-- Beekeeping module: hives + honey harvests (per-user).
create table if not exists hives (
  user_id text not null,
  id text not null,
  name text not null,
  location text,
  status text default 'active',
  queen_year int,
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table hives enable row level security;

create table if not exists honey_records (
  user_id text not null,
  id text not null,
  hive_id text,
  harvest_date date not null,
  kg numeric,
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table honey_records enable row level security;
