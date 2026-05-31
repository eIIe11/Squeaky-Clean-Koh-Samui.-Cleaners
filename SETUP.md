# Setup Guide — Squeaky Clean Koh Samui

> Step-by-step guide for the owner to configure all third-party services.

---

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Run the schema migration: go to **SQL Editor** and paste the contents of `supabase/schema.sql`
4. Run the seed data: paste `supabase/seed.sql`
5. Enable **Realtime** on tables: `bookings`, `payments`, `booking_photos`, `booking_checklist_items`
6. Configure **Auth → Providers**:
   - Enable **Email** (magic link) — set redirect URL to `https://squeakycleansamui.com/auth/callback`
   - Enable **Google** — requires Google OAuth client ID/secret (see Section 3)
7. Configure **Storage**:
   - Create buckets: `booking-photos`, `payment-slips`, `reports`
   - Set `booking-photos` to public (photos shown in reports)
   - Set `payment-slips` to private (signed URLs only)

---

## 2. Omise (Opn Payments)

> **Status: Awaiting merchant approval.** Integration is built — just add the keys when approved.

1. Register at [opn.ooo](https://opn.ooo) (requires Thai business documents)
2. Once approved, go to **Dashboard → Keys**
3. Copy:
   - Public key → `NEXT_PUBLIC_OMISE_PUBLIC_KEY`
   - Secret key → `OMISE_SECRET_KEY`
4. Configure **Webhooks** at `https://squeakycleansamui.com/api/webhooks/omise`
5. Enable payment methods: Credit Card, PromptPay

---

## 3. Google OAuth (for customer login)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or use existing
3. Enable **Google Identity** API
4. Go to **Credentials → Create OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorised redirect URIs: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret into Supabase Auth → Google provider settings

---

## 4. Google Maps API

1. In Google Cloud Console, enable:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
2. Create an API key at **Credentials → Create API Key**
3. Restrict to:
   - HTTP referrers: `squeakycleansamui.com/*`
   - APIs: Maps JavaScript, Places, Geocoding
4. Copy key → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 5. Google Calendar API (Cleaner Scheduling)

1. In Google Cloud Console, enable **Google Calendar API**
2. Create a **Service Account** at Credentials → Create Service Account
3. Download the JSON key file
4. Base64-encode the JSON key: `base64 -w 0 service-account.json`
5. Set `GOOGLE_CALENDAR_SERVICE_ACCOUNT` env var to the base64 string
6. Share each cleaner's Google Calendar with the service account email address (read/write)
7. Add each cleaner's calendar ID to their staff profile in the admin panel

---

## 6. Resend (Email)

1. Create account at [resend.com](https://resend.com)
2. Add and verify your sending domain (`squeakycleansamui.com`):
   - Add the MX, SPF, and DKIM DNS records Resend provides
3. Go to **API Keys** → Create a key
4. Copy → `RESEND_API_KEY`
5. Set `RESEND_FROM_EMAIL` to `hello@squeakycleansamui.com`

---

## 7. Twilio (WhatsApp + SMS)

1. Create account at [twilio.com](https://www.twilio.com)
2. Get a Twilio phone number with WhatsApp capability
3. Apply for **WhatsApp Business** sender approval
4. Create and submit message templates for approval (see brief Section 10)
5. Copy:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - WhatsApp number → `TWILIO_WHATSAPP_FROM`
   - SMS number → `TWILIO_SMS_FROM`

---

## 8. PostHog (Analytics)

1. Create account at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy the API key → `NEXT_PUBLIC_POSTHOG_KEY`
4. Copy the host URL → `NEXT_PUBLIC_POSTHOG_HOST`

---

## 9. Google Tag Manager

1. Create a GTM account at [tagmanager.google.com](https://tagmanager.google.com)
2. Create a container (Web)
3. Copy the container ID (e.g., `GTM-XXXXXXX`) → `NEXT_PUBLIC_GTM_ID`
4. Configure tags for GA4, Google Ads, Meta Pixel inside GTM

---

## 10. DNS Configuration (Namecheap)

Add these DNS records for `squeakycleansamui.com`:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | `cname.vercel-dns.com` | Auto |
| CNAME | www | `cname.vercel-dns.com` | Auto |
| TXT | @ | `v=spf1 include:_spf.google.com ~all` | Auto |
| MX | @ | Google Workspace MX records | Auto |

For redirect domains (`squeakycleanthailand.com`, `kohsamuicleaners.com`):
- Add CNAME pointing to `cname.vercel-dns.com`
- Configure 301 redirects in Vercel project settings

---

## 11. Vercel Deployment

1. Connect the GitHub repository to Vercel
2. Set production branch to `main`, preview branch to `dev`
3. Add all environment variables from `.env.example` with their real values
4. Configure domains:
   - Primary: `squeakycleansamui.com`
   - Redirects: `squeakycleanthailand.com` → 301, `kohsamuicleaners.com` → 301

---

## 12. Environment Variables Summary

All variables are listed in `.env.example`. Copy to `.env.local` for development:

```bash
cp .env.example .env.local
# Fill in your values
```

For production, set these in Vercel's environment variable settings.
