-- Part 1: Create ENUM types
-- Run this FIRST in Supabase SQL Editor

CREATE TYPE booking_status AS ENUM ('new','pending_payment','confirmed','assigned','en_route','in_progress','completed','cancelled');
CREATE TYPE payment_method AS ENUM ('qr','bank_transfer','credit_card');
CREATE TYPE payment_status_enum AS ENUM ('unpaid','partial','paid');
CREATE TYPE property_type AS ENUM ('apartment','house','villa','townhouse','office','restaurant','retail','other');
CREATE TYPE category_group AS ENUM ('residential','villa','move','specialised','commercial');
CREATE TYPE recurring_frequency AS ENUM ('weekly','fortnightly','monthly');
CREATE TYPE lead_source AS ENUM ('newsletter','save_quote','callback','booking_abandoned');
CREATE TYPE notification_channel AS ENUM ('email','whatsapp','sms');
CREATE TYPE employment_type AS ENUM ('employed','contractor');
CREATE TYPE unavailability_type AS ENUM ('holiday','sick','personal');
CREATE TYPE payment_record_status AS ENUM ('pending','approved','rejected','refunded');
CREATE TYPE lead_status AS ENUM ('new','contacted','converted','lost');
CREATE TYPE recurring_plan_status AS ENUM ('active','paused','cancelled');
CREATE TYPE photo_type AS ENUM ('before','after','damage','other');
CREATE TYPE setting_type AS ENUM ('text','number','boolean','percent');
