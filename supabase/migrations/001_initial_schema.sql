-- Phase 2A: Full database schema for Squeaky Clean Thailand
-- Run against Supabase via the SQL Editor or supabase CLI

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('new','pending_payment','confirmed','assigned','en_route','in_progress','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('qr','bank_transfer','credit_card');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('unpaid','partial','paid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('apartment','house','villa','townhouse','office','restaurant','retail','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE category_group AS ENUM ('residential','villa','move','specialised','commercial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE recurring_frequency AS ENUM ('weekly','fortnightly','monthly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM ('newsletter','save_quote','callback','booking_abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('email','whatsapp','sms');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE employment_type AS ENUM ('employed','contractor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE unavailability_type AS ENUM ('holiday','sick','personal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_record_status AS ENUM ('pending','approved','rejected','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new','contacted','converted','lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE recurring_plan_status AS ENUM ('active','paused','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE photo_type AS ENUM ('before','after','damage','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE setting_type AS ENUM ('text','number','boolean','percent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- locations (multi-city support)
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Bangkok',
  is_active BOOLEAN NOT NULL DEFAULT true,
  launch_date DATE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- zones (service areas within a location)
CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  travel_fee_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  polygon_coords JSONB,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  UNIQUE(slug, location_id)
);

-- service_categories
CREATE TABLE IF NOT EXISTS service_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT,
  slug TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  category_group category_group NOT NULL,
  base_duration_minutes INTEGER NOT NULL DEFAULT 120,
  base_price_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_bedroom_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_bathroom_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  full_name TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en','th')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  referral_code TEXT NOT NULL UNIQUE DEFAULT ('SC-' || upper(substr(md5(random()::text), 1, 8))),
  referred_by INTEGER REFERENCES customers(id),
  omise_customer_id TEXT,
  notes_internal TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL
);

-- properties
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  district TEXT,
  zone_id INTEGER REFERENCES zones(id),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  property_type property_type NOT NULL DEFAULT 'villa',
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  access_code TEXT,
  key_location TEXT,
  parking_notes TEXT,
  gate_code TEXT,
  pet_info TEXT,
  preferred_cleaner_id INTEGER,
  notes TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- staff
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  google_calendar_id TEXT,
  whatsapp_number TEXT,
  employment_type employment_type NOT NULL DEFAULT 'employed',
  working_days INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}',
  working_hours_start TIME NOT NULL DEFAULT '08:00',
  working_hours_end TIME NOT NULL DEFAULT '17:00',
  zone_ids INTEGER[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes_internal TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- Add FK from properties to staff (after staff created)
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_preferred_cleaner_id_fkey;
ALTER TABLE properties
  ADD CONSTRAINT properties_preferred_cleaner_id_fkey
  FOREIGN KEY (preferred_cleaner_id) REFERENCES staff(id) ON DELETE SET NULL;

-- staff_unavailability
CREATE TABLE IF NOT EXISTS staff_unavailability (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  unavailability_type unavailability_type NOT NULL DEFAULT 'holiday',
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  notes TEXT
);

-- promo_codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('fixed','percent')),
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  service_category_ids INTEGER[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- recurring_plans
CREATE TABLE IF NOT EXISTS recurring_plans (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  frequency recurring_frequency NOT NULL,
  day_of_week INTEGER NOT NULL DEFAULT 1,
  preferred_time TIME NOT NULL DEFAULT '09:00',
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  status recurring_plan_status NOT NULL DEFAULT 'active',
  next_booking_date DATE,
  last_booking_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  booking_reference TEXT NOT NULL UNIQUE DEFAULT ('SC-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random()*9999+1)::text, 4, '0')),
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  status booking_status NOT NULL DEFAULT 'new',
  scheduled_date DATE NOT NULL,
  scheduled_time_start TIME NOT NULL,
  scheduled_time_end TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  num_bedrooms INTEGER NOT NULL DEFAULT 1,
  num_bathrooms INTEGER NOT NULL DEFAULT 1,
  special_requirements JSONB,
  special_instructions TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_plan_id INTEGER REFERENCES recurring_plans(id) ON DELETE SET NULL,
  assigned_cleaners INTEGER[] NOT NULL DEFAULT '{}',
  subtotal_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  travel_fee_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE SET NULL,
  payment_method payment_method,
  payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
  payment_slip_url TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by TEXT,
  notes_internal TEXT,
  metadata JSONB,
  arrived_at TIMESTAMPTZ,
  arrival_lat DOUBLE PRECISION,
  arrival_lng DOUBLE PRECISION,
  arrival_distance_metres NUMERIC(10,2),
  arrival_verified BOOLEAN DEFAULT false,
  arrival_override_reason TEXT,
  job_started_at TIMESTAMPTZ,
  job_completed_at TIMESTAMPTZ,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
);

-- Add FK from recurring_plans to bookings (after bookings created)
ALTER TABLE recurring_plans
  DROP CONSTRAINT IF EXISTS recurring_plans_last_booking_id_fkey;
ALTER TABLE recurring_plans
  ADD CONSTRAINT recurring_plans_last_booking_id_fkey
  FOREIGN KEY (last_booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- booking_photos
CREATE TABLE IF NOT EXISTS booking_photos (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  uploaded_by INTEGER,
  photo_type photo_type NOT NULL DEFAULT 'before',
  url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- checklist_templates
CREATE TABLE IF NOT EXISTS checklist_templates (
  id SERIAL PRIMARY KEY,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false
);

-- booking_checklist_items
CREATE TABLE IF NOT EXISTS booking_checklist_items (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  template_item_id INTEGER REFERENCES checklist_templates(id),
  label TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by INTEGER,
  notes TEXT,
  photo_url TEXT
);

-- payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_method payment_method NOT NULL,
  amount_thb NUMERIC(10,2) NOT NULL,
  omise_charge_id TEXT,
  slip_url TEXT,
  status payment_record_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  processed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  google_review_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- leads
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source lead_source NOT NULL,
  email TEXT,
  phone TEXT,
  name TEXT,
  quote_data JSONB,
  followed_up_at TIMESTAMPTZ,
  follow_up_notes TEXT,
  status lead_status NOT NULL DEFAULT 'new'
);

-- notifications_log
CREATE TABLE IF NOT EXISTS notifications_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('customer','staff')),
  recipient_id INTEGER NOT NULL,
  channel notification_channel NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed','skipped')),
  error_message TEXT
);

-- business_settings (key-value store)
CREATE TABLE IF NOT EXISTS business_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  type setting_type NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- public_holidays
CREATE TABLE IF NOT EXISTS public_holidays (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_properties_customer ON properties(customer_id);
CREATE INDEX IF NOT EXISTS idx_staff_location ON staff(location_id);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active, is_available);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications_log(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_recurring_plans_customer ON recurring_plans(customer_id);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_customers_updated_at ON customers;
CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON bookings;
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_holidays ENABLE ROW LEVEL SECURITY;

-- Public read for reference tables
CREATE POLICY "locations_public_read" ON locations FOR SELECT USING (true);
CREATE POLICY "zones_public_read" ON zones FOR SELECT USING (is_active = true);
CREATE POLICY "service_categories_public_read" ON service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "checklist_templates_public_read" ON checklist_templates FOR SELECT USING (true);
CREATE POLICY "business_settings_public_read" ON business_settings FOR SELECT USING (true);
CREATE POLICY "public_holidays_public_read" ON public_holidays FOR SELECT USING (true);
CREATE POLICY "promo_codes_public_read" ON promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (is_published = true);

-- Customers: users see only their own row
CREATE POLICY "customers_own_read" ON customers FOR SELECT
  USING (auth_user_id = auth.uid());
CREATE POLICY "customers_own_update" ON customers FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "customers_insert" ON customers FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

-- Properties: customers see their own properties
CREATE POLICY "properties_own_read" ON properties FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "properties_own_insert" ON properties FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "properties_own_update" ON properties FOR UPDATE
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Bookings: customers see their own bookings
CREATE POLICY "bookings_own_read" ON bookings FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "bookings_own_insert" ON bookings FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Booking photos: visible to booking owner
CREATE POLICY "booking_photos_own_read" ON booking_photos FOR SELECT
  USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));
CREATE POLICY "booking_photos_insert" ON booking_photos FOR INSERT
  WITH CHECK (true);

-- Booking checklist items: visible to booking owner
CREATE POLICY "booking_checklist_own_read" ON booking_checklist_items FOR SELECT
  USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));

-- Payments: customers see their own payments
CREATE POLICY "payments_own_read" ON payments FOR SELECT
  USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));
CREATE POLICY "payments_insert" ON payments FOR INSERT
  WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));

-- Reviews: customers can create reviews for their bookings
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Recurring plans: customers see their own plans
CREATE POLICY "recurring_plans_own_read" ON recurring_plans FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Staff: public read for active staff (limited fields via API)
CREATE POLICY "staff_public_read" ON staff FOR SELECT USING (is_active = true);

-- Staff unavailability: no public access (admin only via service role)
CREATE POLICY "staff_unavailability_none" ON staff_unavailability FOR SELECT USING (false);

-- Leads: no public read
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_no_read" ON leads FOR SELECT USING (false);

-- Notifications log: no public access
CREATE POLICY "notifications_no_read" ON notifications_log FOR SELECT USING (false);

-- ============================================================
-- REALTIME: enable for key tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
