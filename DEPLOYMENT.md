# GS SPORT - Deployment & Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (recommended)

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, password, and region

### Run Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Paste the contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables, RLS policies, triggers, storage buckets, and seed data

### Enable Auth Providers
1. Go to **Authentication → Providers**
2. Enable **Email** (enabled by default)
3. For Google OAuth:
   - Enable **Google**
   - Add your Google OAuth Client ID and Secret
   - Set redirect URL to `https://your-domain.com/auth/callback`

### Get API Keys
From **Settings → API**, copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---


## 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Your deployed site URL |

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Stripe Local Testing
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 5. Deploy to Vercel

### Option A: One-Click Deploy
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables
5. Deploy

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Post-Deployment
1. Update `NEXT_PUBLIC_SITE_URL` env var with your Vercel URL
2. Update Stripe webhook endpoint to your Vercel URL
3. Update Supabase Auth redirect URLs (Settings → Authentication → URL Configuration)

---

## 6. Create Admin User

1. Register a regular account on your site
2. In Supabase Dashboard → Table Editor → `users` table
3. Find your user and change `role` from `user` to `admin`
4. Refresh your browser — you now have access to `/admin`

---

## 7. Storage Buckets

The SQL schema creates storage buckets automatically. Verify in Supabase Dashboard → Storage:
- **products** — Product images (public)
- **banners** — Banner images (public)
- **avatars** — User avatars (public)

If they don't appear, create them manually and set them to **Public**.

---

## Project Structure

```
gs-sport/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin panel (dashboard, products, orders, users, banners, content)
│   │   ├── api/              # API routes (checkout, webhook)
│   │   ├── auth/             # Auth pages (login, register, forgot-password)
│   │   ├── account/          # User account pages
│   │   ├── checkout/         # Checkout flow
│   │   ├── shop/             # Shop listing & product detail
│   │   └── wishlist/         # Wishlist page
│   ├── components/           # Reusable components
│   │   ├── cart/             # Cart drawer
│   │   ├── home/             # Homepage sections
│   │   ├── layout/           # Header, Footer
│   │   ├── product/          # Product card
│   │   └── ui/               # UI primitives (Button, Input, Skeleton, etc.)
│   ├── hooks/                # Custom hooks (useAuth, useSiteContent)
│   ├── lib/                  # Libraries & config
│   │   ├── supabase/         # Supabase client/server/middleware
│   │   ├── stripe/           # Stripe client/server
│   │   ├── animations.ts     # Framer Motion variants
│   │   ├── constants.ts      # Site constants
│   │   └── validations.ts    # Zod schemas
│   ├── store/                # Zustand stores (cart, wishlist)
│   ├── types/                # TypeScript definitions
│   └── utils/                # Utility functions
├── supabase/
│   └── schema.sql            # Complete database schema
├── .env.local.example        # Environment template
├── next.config.mjs           # Next.js config
├── tailwind.config.ts        # Tailwind config
└── middleware.ts              # Auth middleware
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Supabase | Database, Auth, Storage |
| Stripe | Payments |
| Zustand | Client state (cart, wishlist) |
| React Hook Form + Zod | Form validation |
| Lucide React | Icons |
