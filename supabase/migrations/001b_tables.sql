-- Part 2: Create all tables
-- Run this SECOND in Supabase SQL Editor (after 001a_enums.sql)

-- locations (multi-city support)
CREATE TABLE locations (
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
CREATE TABLE zones (
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
CREATE TABLE service_categories (
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
CREATE TABLE customers (
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
CREATE TABLE properties (
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
CREATE TABLE staff (
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

-- Add FK from properties to staff
ALTER TABLE properties
  ADD CONSTRAINT properties_preferred_cleaner_id_fkey
  FOREIGN KEY (preferred_cleaner_id) REFERENCES staff(id) ON DELETE SET NULL;

-- staff_unavailability
CREATE TABLE staff_unavailability (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  unavailability_type unavailability_type NOT NULL DEFAULT 'holiday',
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  notes TEXT
);

-- promo_codes
CREATE TABLE promo_codes (
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
CREATE TABLE recurring_plans (
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
CREATE TABLE bookings (
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

-- Add FK from recurring_plans to bookings
ALTER TABLE recurring_plans
  ADD CONSTRAINT recurring_plans_last_booking_id_fkey
  FOREIGN KEY (last_booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- booking_photos
CREATE TABLE booking_photos (
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
CREATE TABLE checklist_templates (
  id SERIAL PRIMARY KEY,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false
);

-- booking_checklist_items
CREATE TABLE booking_checklist_items (
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
CREATE TABLE payments (
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
CREATE TABLE reviews (
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
CREATE TABLE leads (
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
CREATE TABLE notifications_log (
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
CREATE TABLE business_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  type setting_type NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- public_holidays
CREATE TABLE public_holidays (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
