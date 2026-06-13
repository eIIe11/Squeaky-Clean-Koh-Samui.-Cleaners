-- Phase 2A: Seed data for Squeaky Clean Thailand

-- ============================================================
-- Location: Koh Samui (first city)
-- ============================================================
INSERT INTO locations (name, slug, timezone, is_active, launch_date, seo_title, seo_description)
VALUES (
  'Koh Samui', 'koh-samui', 'Asia/Bangkok', true, '2026-01-01',
  'Professional Cleaning Services in Koh Samui | Squeaky Clean',
  'Premium villa, Airbnb, and residential cleaning services across Koh Samui. Same day availability. 5/5 rated.'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Zones (Koh Samui areas)
-- ============================================================
INSERT INTO zones (name, slug, travel_fee_thb, is_active, location_id) VALUES
  ('Chaweng',       'chaweng',       0,   true, 1),
  ('Lamai',         'lamai',         0,   true, 1),
  ('Bophut',        'bophut',        0,   true, 1),
  ('Maenam',        'maenam',        0,   true, 1),
  ('Nathon',        'nathon',        0,   true, 1),
  ('Lipa Noi',      'lipa-noi',      0,   true, 1),
  ('Taling Ngam',   'taling-ngam',   0,   true, 1),
  ('Choeng Mon',    'choeng-mon',    0,   true, 1),
  ('Bang Rak',      'bang-rak',      0,   true, 1),
  ('Hua Thanon',    'hua-thanon',    0,   true, 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Service Categories
-- ============================================================
INSERT INTO service_categories (name, name_th, slug, description, category_group, base_duration_minutes, base_price_thb, price_per_bedroom_thb, price_per_bathroom_thb, is_active, sort_order, icon, location_id) VALUES
  ('Regular Cleaning',    'ทำความสะอาดทั่วไป',     'regular-cleaning',    'Thorough cleaning of your entire home. Dusting, vacuuming, mopping, kitchen and bathroom sanitising.', 'residential', 120, 1500, 300, 200, true, 1, 'sparkles', 1),
  ('Deep Cleaning',       'ทำความสะอาดแบบล้ำลึก',   'deep-cleaning',       'Intensive top-to-bottom cleaning. Includes inside appliances, behind furniture, grout scrubbing, and window tracks.', 'residential', 240, 3500, 500, 400, true, 2, 'sparkles', 1),
  ('Villa Cleaning',      'ทำความสะอาดวิลล่า',      'villa-cleaning',      'Specialised service for luxury villas. Pool area, outdoor furniture, multiple living areas, and premium finishes.', 'villa', 180, 4000, 600, 400, true, 3, 'home', 1),
  ('Airbnb Turnover',     'ทำความสะอาด Airbnb',     'airbnb-turnover',     'Fast turnover cleaning between guests. Linen change, restocking, and property inspection included.', 'villa', 120, 2500, 400, 300, true, 4, 'key-round', 1),
  ('Move In/Out',         'ย้ายเข้า/ย้ายออก',        'move-in-out',         'Complete cleaning for property handover. Walls wiped, cabinets cleaned inside and out, all fixtures polished.', 'move', 300, 5000, 600, 500, true, 5, 'truck', 1),
  ('Post-Construction',   'หลังก่อสร้าง',           'post-construction',   'Heavy-duty cleaning after renovation or building work. Dust removal, debris clearing, and surface treatment.', 'specialised', 360, 6000, 800, 600, true, 6, 'hard-hat', 1),
  ('Office Cleaning',     'ทำความสะอาดสำนักงาน',    'office-cleaning',     'Professional office and co-working space cleaning. Desks, common areas, restrooms, and kitchen facilities.', 'commercial', 120, 2000, 0, 300, true, 7, 'building-2', 1),
  ('Restaurant Cleaning', 'ทำความสะอาดร้านอาหาร',   'restaurant-cleaning', 'Commercial kitchen and dining area deep cleaning. Hood extraction, floor degreasing, and health-standard sanitising.', 'commercial', 240, 4500, 0, 500, true, 8, 'utensils-crossed', 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Business Settings
-- ============================================================
INSERT INTO business_settings (key, value, label, type) VALUES
  ('deposit_percent',               '30',    'Deposit Percentage',                    'percent'),
  ('same_day_booking_cutoff_hours',  '4',     'Same-Day Booking Cutoff (hours)',        'number'),
  ('emergency_booking_fee_thb',      '500',   'Emergency Booking Fee (THB)',            'number'),
  ('cancellation_free_hours',        '24',    'Free Cancellation Window (hours)',       'number'),
  ('reschedule_free_hours',          '12',    'Free Reschedule Window (hours)',         'number'),
  ('recurring_weekly_discount',      '15',    'Weekly Plan Discount %',                'percent'),
  ('recurring_fortnightly_discount', '10',    'Fortnightly Plan Discount %',           'percent'),
  ('recurring_monthly_discount',     '5',     'Monthly Plan Discount %',               'percent'),
  ('payment_slip_approval_required', 'true',  'Require Manual Slip Approval',          'boolean'),
  ('review_request_delay_hours',     '2',     'Review Request Delay (hours)',           'number'),
  ('bank_account_name',             '',       'Bank Account Name',                     'text'),
  ('bank_account_number',           '',       'Bank Account Number',                   'text'),
  ('bank_name',                     '',       'Bank Name',                             'text'),
  ('promptpay_id',                  '',       'PromptPay ID',                          'text'),
  ('owner_whatsapp_number',         '',       'Owner WhatsApp Number',                 'text'),
  ('business_hours_start',          '07:00',  'Business Hours Start',                  'text'),
  ('business_hours_end',            '20:00',  'Business Hours End',                    'text'),
  ('min_booking_lead_hours',        '2',      'Minimum Booking Lead Time (hours)',      'number')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Checklist Templates (for Regular Cleaning)
-- ============================================================
INSERT INTO checklist_templates (service_category_id, section, label, sort_order, is_required) VALUES
  -- Kitchen
  (1, 'Kitchen', 'Wipe all countertops and surfaces', 1, true),
  (1, 'Kitchen', 'Clean sink and faucet', 2, true),
  (1, 'Kitchen', 'Clean stovetop and range hood exterior', 3, true),
  (1, 'Kitchen', 'Wipe appliance exteriors', 4, false),
  (1, 'Kitchen', 'Empty bins and replace liners', 5, true),
  (1, 'Kitchen', 'Mop floor', 6, true),
  -- Bathrooms
  (1, 'Bathrooms', 'Scrub toilet inside and out', 10, true),
  (1, 'Bathrooms', 'Clean shower/bathtub', 11, true),
  (1, 'Bathrooms', 'Clean mirror and glass', 12, true),
  (1, 'Bathrooms', 'Wipe vanity and sink', 13, true),
  (1, 'Bathrooms', 'Mop floor', 14, true),
  (1, 'Bathrooms', 'Restock toiletries if provided', 15, false),
  -- Living Areas
  (1, 'Living Areas', 'Dust all surfaces and shelves', 20, true),
  (1, 'Living Areas', 'Vacuum/sweep floors', 21, true),
  (1, 'Living Areas', 'Mop hard floors', 22, true),
  (1, 'Living Areas', 'Wipe light switches and door handles', 23, false),
  (1, 'Living Areas', 'Arrange cushions and throws', 24, false),
  -- Bedrooms
  (1, 'Bedrooms', 'Make beds/change linens', 30, true),
  (1, 'Bedrooms', 'Dust all surfaces', 31, true),
  (1, 'Bedrooms', 'Vacuum/sweep floors', 32, true),
  (1, 'Bedrooms', 'Empty bins', 33, true)
ON CONFLICT DO NOTHING;

-- Checklist for Villa Cleaning (service_category_id = 3)
INSERT INTO checklist_templates (service_category_id, section, label, sort_order, is_required) VALUES
  (3, 'Kitchen', 'Full kitchen clean including appliance interiors', 1, true),
  (3, 'Kitchen', 'Clean and organise pantry shelves', 2, false),
  (3, 'Bathrooms', 'Deep clean all bathrooms', 10, true),
  (3, 'Bathrooms', 'Polish chrome fixtures', 11, true),
  (3, 'Living Areas', 'Dust all surfaces including ceiling fans', 20, true),
  (3, 'Living Areas', 'Clean all glass doors and windows (interior)', 21, true),
  (3, 'Living Areas', 'Vacuum all upholstery', 22, false),
  (3, 'Bedrooms', 'Full bedroom clean with linen change', 30, true),
  (3, 'Pool Area', 'Sweep pool deck', 40, true),
  (3, 'Pool Area', 'Wipe outdoor furniture', 41, true),
  (3, 'Pool Area', 'Clean outdoor shower', 42, false),
  (3, 'Exterior', 'Sweep entrance and walkways', 50, true),
  (3, 'Exterior', 'Remove cobwebs from exterior walls', 51, false)
ON CONFLICT DO NOTHING;

-- Checklist for Airbnb Turnover (service_category_id = 4)
INSERT INTO checklist_templates (service_category_id, section, label, sort_order, is_required) VALUES
  (4, 'Kitchen', 'Full kitchen clean and sanitise', 1, true),
  (4, 'Kitchen', 'Check and restock kitchen supplies', 2, true),
  (4, 'Bathrooms', 'Full bathroom clean and sanitise', 10, true),
  (4, 'Bathrooms', 'Restock toiletries and towels', 11, true),
  (4, 'Bedrooms', 'Strip and remake all beds with fresh linens', 20, true),
  (4, 'Bedrooms', 'Check under beds and in drawers', 21, true),
  (4, 'Living Areas', 'Full living area clean', 30, true),
  (4, 'Living Areas', 'Reset welcome materials', 31, false),
  (4, 'Inspection', 'Check all lights and A/C units', 40, true),
  (4, 'Inspection', 'Report any damage or maintenance needed', 41, true),
  (4, 'Inspection', 'Lock up and secure property', 42, true)
ON CONFLICT DO NOTHING;
