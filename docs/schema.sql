-- AgroKos — Supabase schema (PostgreSQL) with Row Level Security.
-- Every user-owned table carries `user_id` = Clerk user id for RLS.
-- Apply with: supabase db push  (or paste into the SQL editor).

-- ── Farmer profile (extends Clerk auth) ───────────────────────────────
CREATE TABLE farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  municipality TEXT,
  village TEXT,
  farm_size_ha DECIMAL(10,2),
  primary_crops TEXT[],
  language_pref TEXT DEFAULT 'sq',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Crops library (seeded with Kosovo crops) ──────────────────────────
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_sq TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT,
  growing_season_start INT,
  growing_season_end INT,
  water_need TEXT,
  avg_yield_kg_ha DECIMAL(10,2),
  market_price_eur_kg DECIMAL(6,3),
  icon_emoji TEXT,
  color_hex TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Fields / plots ────────────────────────────────────────────────────
CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  area_ha DECIMAL(8,3),
  geojson JSONB,
  soil_type TEXT,
  irrigation_type TEXT,
  municipality TEXT,
  village TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  current_crop_id UUID REFERENCES crops(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Plantings ─────────────────────────────────────────────────────────
CREATE TABLE plantings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id),
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  seed_variety TEXT,
  seed_quantity_kg DECIMAL(8,2),
  status TEXT DEFAULT 'active',
  notes TEXT,
  yield_kg DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Activities ────────────────────────────────────────────────────────
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  field_id UUID REFERENCES fields(id),
  planting_id UUID REFERENCES plantings(id),
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL,
  description TEXT,
  input_used TEXT,
  input_quantity DECIMAL(8,2),
  input_unit TEXT,
  cost_eur DECIMAL(8,2),
  performed_by TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Soil analyses ─────────────────────────────────────────────────────
CREATE TABLE soil_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  field_id UUID REFERENCES fields(id),
  analysis_date DATE,
  ph DECIMAL(4,2),
  nitrogen_ppm DECIMAL(8,2),
  phosphorus_ppm DECIMAL(8,2),
  potassium_ppm DECIMAL(8,2),
  organic_matter_pct DECIMAL(5,2),
  moisture_pct DECIMAL(5,2),
  lab_name TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Alerts ────────────────────────────────────────────────────────────
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  field_id UUID REFERENCES fields(id),
  alert_type TEXT,
  severity TEXT,
  title_sq TEXT, title_en TEXT,
  message_sq TEXT, message_en TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ
);

-- ── Market prices ─────────────────────────────────────────────────────
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID REFERENCES crops(id),
  price_eur_kg DECIMAL(6,3),
  market_location TEXT,
  price_date DATE,
  source TEXT,
  trend TEXT,
  pct_change_week DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Inventory ─────────────────────────────────────────────────────────
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity DECIMAL(10,2),
  unit TEXT,
  purchase_date DATE,
  purchase_price_eur DECIMAL(8,2),
  supplier TEXT,
  expiry_date DATE,
  low_stock_threshold DECIMAL(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Weather cache ─────────────────────────────────────────────────────
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  forecast_data JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Pattern: each user only sees their own rows. `app.clerk_user_id` is set
-- per-request via supabase.rpc('set_config', { key, value }), or use the
-- service-role key server-side and filter by user_id manually.
CREATE POLICY "own_fields" ON fields FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_plantings" ON plantings FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_activities" ON activities FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_soil" ON soil_analyses FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_alerts" ON alerts FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_inventory" ON inventory FOR ALL
  USING (user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "own_profile" ON farmer_profiles FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', true));
