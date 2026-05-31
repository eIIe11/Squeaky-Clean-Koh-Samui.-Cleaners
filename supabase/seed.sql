-- Squeaky Clean Koh Samui — Seed Data
-- Run after schema.sql to populate initial data

-- ============================================================
-- LOCATION
-- ============================================================
INSERT INTO locations (name, slug, timezone, is_active, seo_title, seo_description) VALUES
('Koh Samui', 'koh-samui', 'Asia/Bangkok', true, 'Professional Cleaning Services in Koh Samui', 'Premium residential and commercial cleaning services across Koh Samui. Villa cleaning, Airbnb turnover, deep cleaning and more.');

-- ============================================================
-- ZONES (Koh Samui districts)
-- ============================================================
INSERT INTO zones (name, slug, travel_fee_thb, is_active, location_id) VALUES
('Chaweng', 'chaweng', 0, true, 1),
('Chaweng Noi', 'chaweng-noi', 0, true, 1),
('Lamai', 'lamai', 100, true, 1),
('Bophut', 'bophut', 0, true, 1),
('Fisherman''s Village', 'fishermans-village', 0, true, 1),
('Maenam', 'maenam', 150, true, 1),
('Bang Rak', 'bang-rak', 100, true, 1),
('Lipa Noi', 'lipa-noi', 200, true, 1),
('Taling Ngam', 'taling-ngam', 250, true, 1),
('Nathon', 'nathon', 200, true, 1),
('Choeng Mon', 'choeng-mon', 100, true, 1),
('Plai Laem', 'plai-laem', 100, true, 1);

-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================
INSERT INTO service_categories (name, slug, description, category_group, base_duration_minutes, base_price_thb, price_per_bedroom_thb, price_per_bathroom_thb, is_active, sort_order, icon, location_id) VALUES
('Regular Cleaning', 'regular-cleaning', 'Comprehensive routine cleaning for homes and apartments. Includes all rooms, kitchen, and bathrooms.', 'residential', 120, 1500, 300, 200, true, 1, 'sparkles', 1),
('Deep Cleaning', 'deep-cleaning', 'Intensive top-to-bottom cleaning. Includes behind furniture, inside appliances, grout scrubbing, and detailed attention to every surface.', 'residential', 240, 3500, 500, 400, true, 2, 'zap', 1),
('Villa Cleaning', 'villa-cleaning', 'Premium cleaning service designed for Koh Samui villas. Pool area tidying, outdoor spaces, and multi-level properties.', 'villa', 180, 4000, 600, 400, true, 3, 'home', 1),
('Airbnb Turnover', 'airbnb-turnover', 'Fast, thorough turnover cleaning between guests. Linen change, restocking, and property inspection included.', 'villa', 120, 2500, 400, 300, true, 4, 'repeat', 1),
('Move-In / Move-Out', 'move-in-out-cleaning', 'Complete cleaning for property transitions. Inside cabinets, appliance cleaning, wall washing, and window tracks.', 'move', 300, 5000, 600, 500, true, 5, 'truck', 1),
('Post-Construction', 'post-construction-cleaning', 'Specialist cleaning after renovation or construction. Dust removal, debris clearing, cement residue cleaning.', 'specialised', 360, 6000, 700, 500, true, 6, 'hard-hat', 1),
('Office Cleaning', 'office-cleaning', 'Professional cleaning for offices and co-working spaces. Desks, meeting rooms, restrooms, and common areas.', 'commercial', 120, 2000, 0, 300, true, 7, 'building', 1),
('Restaurant Cleaning', 'restaurant-cleaning', 'Kitchen deep clean, dining area, restrooms. Food-safe cleaning products and grease removal specialists.', 'commercial', 180, 4500, 0, 500, true, 8, 'utensils', 1),
('End of Lease', 'end-of-lease-cleaning', 'Bond-back guarantee cleaning. Meets landlord inspection standards. Includes oven, windows, and carpet spot treatment.', 'move', 240, 4500, 500, 400, true, 9, 'key', 1),
('Window Cleaning', 'window-cleaning', 'Interior and exterior window cleaning. Includes frames, tracks, and screens.', 'specialised', 120, 2000, 0, 0, true, 10, 'wind', 1);

-- ============================================================
-- BUSINESS SETTINGS
-- ============================================================
INSERT INTO business_settings (key, value, label, type) VALUES
('deposit_percent', '30', 'Deposit Percentage', 'percent'),
('same_day_booking_cutoff_hours', '4', 'Same-Day Booking Cutoff (hours)', 'number'),
('emergency_booking_fee_thb', '500', 'Emergency Booking Fee (THB)', 'number'),
('cancellation_free_hours', '24', 'Free Cancellation Window (hours)', 'number'),
('reschedule_free_hours', '12', 'Free Reschedule Window (hours)', 'number'),
('recurring_weekly_discount', '15', 'Weekly Recurring Discount', 'percent'),
('recurring_fortnightly_discount', '10', 'Fortnightly Recurring Discount', 'percent'),
('recurring_monthly_discount', '5', 'Monthly Recurring Discount', 'percent'),
('payment_slip_approval_required', 'true', 'Manual Slip Approval Required', 'boolean'),
('review_request_delay_hours', '2', 'Review Request Delay (hours)', 'number'),
('bank_account_name', '', 'Bank Account Name', 'text'),
('bank_account_number', '', 'Bank Account Number', 'text'),
('bank_name', '', 'Bank Name', 'text'),
('promptpay_id', '', 'PromptPay ID', 'text'),
('notify_owner_on_arrival', 'true', 'Notify Owner on Arrival', 'boolean'),
('notify_customer_on_arrival', 'true', 'Notify Customer on Arrival', 'boolean'),
('owner_whatsapp_number', '', 'Owner WhatsApp Number', 'text'),
('referral_credit_thb', '200', 'Referral Credit Amount (THB)', 'number');
