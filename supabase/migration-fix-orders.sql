-- ============================================
-- GS SPORT - Database Migration
-- Run this in Supabase SQL Editor for project nsupmxkzcwgdzyloyzog
-- ============================================

-- 1. Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bog_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bog_payment_hash TEXT;

-- 2. Add missing columns to site_content table
DO $$
BEGIN
  -- Add id column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='id' AND table_schema='public') THEN
    ALTER TABLE public.site_content ADD COLUMN id TEXT DEFAULT (gen_random_uuid())::TEXT;
    UPDATE public.site_content SET id = (gen_random_uuid())::TEXT WHERE id IS NULL;
    ALTER TABLE public.site_content ALTER COLUMN id SET NOT NULL;
  END IF;
  
  -- Add section column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='section' AND table_schema='public') THEN
    ALTER TABLE public.site_content ADD COLUMN section TEXT NOT NULL DEFAULT 'general';
  END IF;
  
  -- Add label column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='label' AND table_schema='public') THEN
    ALTER TABLE public.site_content ADD COLUMN label TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add created_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='created_at' AND table_schema='public') THEN
    ALTER TABLE public.site_content ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- 3. Create gif_sections table if missing
CREATE TABLE IF NOT EXISTS public.gif_sections (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::TEXT,
  title TEXT,
  gif_url TEXT NOT NULL,
  category_id TEXT,
  product_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ensure products.gender column exists (used in code)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='gender' AND table_schema='public') THEN
    ALTER TABLE public.products ADD COLUMN gender TEXT NOT NULL DEFAULT 'unisex';
  END IF;
END $$;

-- 5. Ensure orders.id has a default
ALTER TABLE public.orders ALTER COLUMN id SET DEFAULT (gen_random_uuid())::TEXT;

-- 6. Ensure order_items.id has a default
ALTER TABLE public.order_items ALTER COLUMN id SET DEFAULT (gen_random_uuid())::TEXT;

-- 7. Disable RLS on all tables (for service role access)
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gif_sections DISABLE ROW LEVEL SECURITY;

-- 8. Disable RLS on wishlist if it exists
DO $$
BEGIN
  EXECUTE 'ALTER TABLE public.wishlist DISABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN
  NULL; -- table doesn't exist, that's fine
END $$;

-- 9. Create or replace decrease_stock function
CREATE OR REPLACE FUNCTION public.decrease_stock(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(stock - p_quantity, 0)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Done!
SELECT 'Migration complete!' AS result;
