-- Part 3: Indexes, Triggers, and RLS policies
-- Run this THIRD in Supabase SQL Editor (after 001b_tables.sql)

-- INDEXES
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_location ON bookings(location_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_properties_customer ON properties(customer_id);
CREATE INDEX idx_staff_location ON staff(location_id);
CREATE INDEX idx_staff_active ON staff(is_active, is_available);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_notifications_recipient ON notifications_log(recipient_type, recipient_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_recurring_plans_customer ON recurring_plans(customer_id);

-- TRIGGER: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
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

-- Staff: public read for active staff
CREATE POLICY "staff_public_read" ON staff FOR SELECT USING (is_active = true);

-- Staff unavailability: no public access (admin only via service role)
CREATE POLICY "staff_unavailability_none" ON staff_unavailability FOR SELECT USING (false);

-- Leads: insert allowed, no public read
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_no_read" ON leads FOR SELECT USING (false);

-- Notifications log: no public access
CREATE POLICY "notifications_no_read" ON notifications_log FOR SELECT USING (false);

-- REALTIME: enable for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
