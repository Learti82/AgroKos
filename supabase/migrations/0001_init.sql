-- AgroKos initial schema.
-- Per-user tables use a composite primary key (user_id, id) so each farmer's
-- demo seed ids ("field-1", …) never collide across accounts. The app reads
-- and writes these tables server-side with the service-role key, so RLS is
-- enabled with no public policies (the anon key cannot read user data).

-- ── Farmer profiles (one row per Clerk user) ──────────────────────────
CREATE TABLE IF NOT EXISTS farmer_profiles (
  clerk_user_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  municipality TEXT,
  village TEXT,
  farm_size_ha NUMERIC,
  primary_crops TEXT[] DEFAULT '{}',
  language_pref TEXT DEFAULT 'sq',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Fields ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fields (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  area_ha NUMERIC,
  geojson JSONB,
  soil_type TEXT,
  irrigation_type TEXT,
  municipality TEXT,
  village TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  current_crop_id TEXT,
  health TEXT DEFAULT 'good',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ── Plantings ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plantings (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  field_id TEXT,
  crop_id TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  seed_variety TEXT,
  seed_quantity_kg NUMERIC,
  status TEXT DEFAULT 'active',
  notes TEXT,
  yield_kg NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ── Activities ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  field_id TEXT,
  planting_id TEXT,
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL,
  description TEXT,
  input_used TEXT,
  input_quantity NUMERIC,
  input_unit TEXT,
  cost_eur NUMERIC DEFAULT 0,
  performed_by TEXT DEFAULT 'self',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ── Soil analyses ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soil_analyses (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  field_id TEXT,
  analysis_date DATE,
  ph NUMERIC,
  nitrogen_ppm NUMERIC,
  phosphorus_ppm NUMERIC,
  potassium_ppm NUMERIC,
  organic_matter_pct NUMERIC,
  moisture_pct NUMERIC,
  lab_name TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ── Alerts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  field_id TEXT,
  alert_type TEXT,
  severity TEXT,
  title_sq TEXT,
  title_en TEXT,
  message_sq TEXT,
  message_en TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  PRIMARY KEY (user_id, id)
);

-- ── Inventory ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC,
  unit TEXT,
  purchase_date DATE,
  purchase_price_eur NUMERIC,
  supplier TEXT,
  expiry_date DATE,
  low_stock_threshold NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ── Lock down: enable RLS, no public policies (service-role bypasses) ──
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields          ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_analyses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory       ENABLE ROW LEVEL SECURITY;
