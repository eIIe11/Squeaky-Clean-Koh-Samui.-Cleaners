# Architectural Decisions Log

> Every significant architectural decision is recorded here with reasoning. See the brief (v3.0) for full context.

---

## D-001: Next.js 16 with App Router + `src/` directory

**Decision:** Use Next.js latest (16.x) with the App Router and a `src/` directory layout.

**Reasoning:** App Router provides built-in SSR/SSG, streaming, server components, and `generateMetadata` for SEO — all required by the brief. The `src/` directory keeps root clean for config files. Aligns with the brief's stack table.

---

## D-002: Supabase for database, auth, storage, and realtime

**Decision:** Use Supabase as the single backend service covering PostgreSQL, auth (magic link + Google SSO), file storage (photos, payment slips), and realtime subscriptions.

**Reasoning:** The brief explicitly specifies Supabase. It eliminates the need for a separate auth provider, file storage service, and websocket server. Row Level Security (RLS) provides per-row access control without custom middleware.

---

## D-003: next-intl for i18n from day one

**Decision:** Use `next-intl` with `/[locale]/...` routing. Launch with English only; Thai locale files are stubbed.

**Reasoning:** Brief Section 21 requires i18n architecture from day one. `next-intl` integrates natively with App Router, supports server components, and handles locale routing. Extracting all strings into message files now avoids a painful retrofit later.

---

## D-004: Omise integration built but credentials deferred

**Decision:** Full Omise payment integration (credit card, PromptPay QR, bank transfer) is architecturally complete with placeholder credential slots. `OMISE_PUBLIC_KEY` and `OMISE_SECRET_KEY` stored as environment variables, left blank in `.env.example`.

**Reasoning:** Per user instructions — merchant account is pending approval. The integration code is ready to activate by filling in the keys.

---

## D-005: Tailwind CSS v4 with design tokens

**Decision:** Use Tailwind CSS v4 (bundled with Next.js 16) with CSS custom properties for the brand palette defined in `globals.css`.

**Reasoning:** Tailwind v4 uses the Oxide engine and CSS-first configuration. Design tokens from the brief (Section 20) are mapped to CSS variables, allowing easy theme updates.

---

## D-006: Multi-location architecture from day one

**Decision:** Include `locations` table and `location_id` foreign keys on relevant tables. Default to Koh Samui (single location) with no picker UI until a second city is activated.

**Reasoning:** Brief Section 29 requires this. Adding foreign keys now costs nothing; retrofitting them later requires a migration on every table.

---

## D-007: react-hook-form + zod for all forms

**Decision:** Use `react-hook-form` with `zod` schemas for validation across all forms (booking flow, admin, customer portal).

**Reasoning:** Brief Appendix B recommends this combination. Zod provides runtime type safety that mirrors TypeScript types, and react-hook-form minimizes re-renders in complex multi-step forms.

---

## D-008: date-fns for date manipulation

**Decision:** Use `date-fns` instead of Moment.js or Day.js.

**Reasoning:** Tree-shakeable, immutable, and recommended in the brief's Appendix B. Supports Thai locale formatting for future i18n.

---

## D-009: Lucide React for icons

**Decision:** Use `lucide-react` for all UI icons.

**Reasoning:** Tree-shakeable SVG icon library, consistent style, well-maintained. Avoids the bundle size of icon fonts.

---

## D-010: No separate CMS — admin UI for content

**Decision:** Content management (services, blog posts, settings) is handled through the admin dashboard UI, not a headless CMS.

**Reasoning:** Brief explicitly states "None initially — admin UI" for CMS. At this scale, a CMS adds deployment complexity without proportional benefit.

---

## D-011: Server Components by default, Client Components where needed

**Decision:** All pages render as React Server Components (RSC) by default. Client Components (`'use client'`) are used only for interactive elements: forms, booking wizard, real-time subscriptions, drag-and-drop.

**Reasoning:** Server Components reduce client-side JavaScript, improving Core Web Vitals (LCP, TTI) as required by the brief (Section 24). Interactive features are isolated to client boundaries.

---

## D-012: Database schema uses JSONB for extensibility

**Decision:** `bookings.metadata`, `bookings.special_requirements`, and `staff` metadata use JSONB columns for extensible fields.

**Reasoning:** Brief Section 5 explicitly requires this for future service verticals (gardening, pool maintenance) without schema migrations.
