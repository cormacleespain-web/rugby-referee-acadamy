# Referee Academy

Professional match review and coaching for rugby referees. Referees submit match footage for expert analysis and receive detailed feedback and performance insights.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4, ShadCN UI
- **Animation:** Motion.dev
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Auth:** Supabase Auth
- **Payments:** Stripe Checkout + webhooks
- **Email:** Resend
- **i18n:** next-intl

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL` — Supabase project
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe (and optionally `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - `RESEND_API_KEY`, `CONTACT_EMAIL` — Resend for contact form and transactional email
   - `NEXT_PUBLIC_APP_URL` — App URL (e.g. `http://localhost:3000` or production URL)

3. **Database**

   - Create a Supabase project and run the Drizzle migration in `drizzle/0000_init.sql` (or use `npm run db:push` with `DATABASE_URL` set).
   - Run `supabase/seed.sql` to insert services and default pricing.
   - Run `supabase/auth-trigger.sql` to create the profile-on-signup trigger.
   - Run `supabase/rls-policies.sql` to enable Row Level Security.

4. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push the project to GitHub and import it in Vercel.
2. Add all environment variables in the Vercel project settings.
3. For Stripe webhooks, set the endpoint to `https://your-domain.com/api/webhooks/stripe` and use the signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run db:generate` — Generate Drizzle migrations
- `npm run db:push` — Push schema to database
- `npm run db:studio` — Open Drizzle Studio

## Roles

- **referee** — Create submissions, pay, view own reports
- **coach** — View assigned submissions, write and submit reports
- **admin** — Full access: submissions, users, coaches, assign coaches to paid submissions

Set `role` on the `profiles` table (or via Supabase dashboard) after signup. New users get `referee` by default.
