-- Dairy / livestock module: animals + milk records (per-user).
create table if not exists animals (
  user_id text not null,
  id text not null,
  tag text not null,
  species text default 'cow',
  breed text,
  birth_date date,
  status text default 'active',
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table animals enable row level security;

create table if not exists milk_records (
  user_id text not null,
  id text not null,
  animal_id text,
  record_date date not null,
  litres numeric,
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, id)
);
alter table milk_records enable row level security;
