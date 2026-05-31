-- Squeaky Clean Koh Samui — Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- LOCATIONS (multi-location architecture)
-- ============================================================
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Bangkok',
  is_active BOOLEAN NOT NULL DEFAULT true,
  launch_date DATE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ZONES
-- ============================================================
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  travel_fee_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  polygon_coords JSONB,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  UNIQUE(slug, location_id)
);

-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT,
  slug TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  category_group TEXT NOT NULL CHECK (category_group IN ('residential', 'villa', 'move', 'specialised', 'commercial')),
  base_duration_minutes INTEGER NOT NULL DEFAULT 120,
  base_price_thb NUMERIC(10,2) NOT NULL,
  price_per_bedroom_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_bathroom_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  UNIQUE(slug, location_id)
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  full_name TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'th')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  referral_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by INTEGER REFERENCES customers(id),
  omise_customer_id TEXT,
  notes_internal TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  auth_user_id UUID REFERENCES auth.users(id)
);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  district TEXT,
  zone_id INTEGER REFERENCES zones(id),
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  property_type TEXT NOT NULL DEFAULT 'house' CHECK (property_type IN ('apartment', 'house', 'villa', 'townhouse', 'office', 'restaurant', 'retail', 'other')),
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  access_code TEXT,
  key_location TEXT,
  parking_notes TEXT,
  gate_code TEXT,
  pet_info TEXT,
  preferred_cleaner_id INTEGER,
  notes TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

-- ============================================================
-- STAFF
-- ============================================================
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  google_calendar_id TEXT,
  whatsapp_number TEXT,
  employment_type TEXT NOT NULL DEFAULT 'employed' CHECK (employment_type IN ('employed', 'contractor')),
  working_days INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}',
  working_hours_start TIME NOT NULL DEFAULT '08:00',
  working_hours_end TIME NOT NULL DEFAULT '17:00',
  zone_ids INTEGER[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes_internal TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

-- ============================================================
-- PROMO CODES
-- ============================================================
CREATE TABLE promo_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('fixed', 'percent')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  service_category_ids INTEGER[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

-- ============================================================
-- RECURRING PLANS
-- ============================================================
CREATE TABLE recurring_plans (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  property_id INTEGER NOT NULL REFERENCES properties(id),
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'fortnightly', 'monthly')),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  preferred_time TIME,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_booking_date DATE,
  last_booking_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  booking_reference TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  property_id INTEGER NOT NULL REFERENCES properties(id),
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending_payment', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE NOT NULL,
  scheduled_time_start TIME NOT NULL,
  scheduled_time_end TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  num_bedrooms INTEGER NOT NULL DEFAULT 1,
  num_bathrooms INTEGER NOT NULL DEFAULT 1,
  special_requirements JSONB,
  special_instructions TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_plan_id INTEGER REFERENCES recurring_plans(id),
  assigned_cleaners INTEGER[] NOT NULL DEFAULT '{}',
  subtotal_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  travel_fee_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_thb NUMERIC(10,2) NOT NULL DEFAULT 0,
  promo_code_id INTEGER REFERENCES promo_codes(id),
  payment_method TEXT CHECK (payment_method IN ('qr', 'bank_transfer', 'credit_card')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  payment_slip_url TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by TEXT,
  notes_internal TEXT,
  metadata JSONB,
  -- GPS arrival fields
  arrived_at TIMESTAMPTZ,
  arrival_lat NUMERIC(10,7),
  arrival_lng NUMERIC(10,7),
  arrival_distance_metres INTEGER,
  arrival_verified BOOLEAN,
  arrival_override_reason TEXT,
  job_started_at TIMESTAMPTZ,
  job_completed_at TIMESTAMPTZ,
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

-- ============================================================
-- BOOKING PHOTOS
-- ============================================================
CREATE TABLE booking_photos (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  uploaded_by TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'after', 'damage', 'other')),
  url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHECKLIST TEMPLATES
-- ============================================================
CREATE TABLE checklist_templates (
  id SERIAL PRIMARY KEY,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false
);

-- ============================================================
-- BOOKING CHECKLIST ITEMS
-- ============================================================
CREATE TABLE booking_checklist_items (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  template_item_id INTEGER REFERENCES checklist_templates(id),
  label TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  notes TEXT,
  photo_url TEXT
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('qr', 'bank_transfer', 'credit_card')),
  amount_thb NUMERIC(10,2) NOT NULL,
  omise_charge_id TEXT,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  processed_at TIMESTAMPTZ,
  processed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  google_review_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL CHECK (source IN ('newsletter', 'save_quote', 'callback', 'booking_abandoned')),
  email TEXT,
  phone TEXT,
  name TEXT,
  quote_data JSONB,
  followed_up_at TIMESTAMPTZ,
  follow_up_notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost'))
);

-- ============================================================
-- STAFF UNAVAILABILITY
-- ============================================================
CREATE TABLE staff_unavailability (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  unavailability_type TEXT NOT NULL CHECK (unavailability_type IN ('holiday', 'sick', 'personal')),
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  notes TEXT
);

-- ============================================================
-- NOTIFICATIONS LOG
-- ============================================================
CREATE TABLE notifications_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('customer', 'staff')),
  recipient_id INTEGER NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT
);

-- ============================================================
-- BUSINESS SETTINGS
-- ============================================================
CREATE TABLE business_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'number', 'boolean', 'percent')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- ============================================================
-- PUBLIC HOLIDAYS
-- ============================================================
CREATE TABLE public_holidays (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  UNIQUE(date, location_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_location ON bookings(location_id);
CREATE INDEX idx_properties_customer ON properties(customer_id);
CREATE INDEX idx_staff_location ON staff(location_id);
CREATE INDEX idx_zones_location ON zones(location_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_auth_user ON customers(auth_user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_holidays ENABLE ROW LEVEL SECURITY;

-- Public read policies (service info, zones, locations)
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read service_categories" ON service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read zones" ON zones FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published reviews" ON reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public read business_settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Public read public_holidays" ON public_holidays FOR SELECT USING (true);
CREATE POLICY "Public read checklist_templates" ON checklist_templates FOR SELECT USING (true);

-- Customer policies (authenticated users see their own data)
CREATE POLICY "Customers see own profile" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Customers update own profile" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Customers see own properties" ON properties
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Customers manage own properties" ON properties
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Customers see own bookings" ON bookings
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Customers see own payments" ON payments
  FOR SELECT USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));

CREATE POLICY "Customers see own recurring plans" ON recurring_plans
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Customers see booking photos" ON booking_photos
  FOR SELECT USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));

CREATE POLICY "Customers see booking checklist" ON booking_checklist_items
  FOR SELECT USING (booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));

-- Service role bypass (admin operations use service_role key)
-- The service_role key bypasses RLS by default in Supabase

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  seq_num INTEGER;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(booking_reference FROM 'KS-\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO seq_num
  FROM bookings
  WHERE booking_reference LIKE 'KS-' || year_str || '-%';
  NEW.booking_reference := 'KS-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_generate_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_reference IS NULL OR NEW.booking_reference = '')
  EXECUTE FUNCTION generate_booking_reference();
