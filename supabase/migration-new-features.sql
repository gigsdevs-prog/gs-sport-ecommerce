-- ============================================
-- GS SPORT - Migration: New Features
-- Run this in Supabase SQL Editor AFTER the
-- existing schema.sql and migration-gifs-about.sql
-- ============================================

-- 1. ADD product_id TO gif_sections (for linking GIFs to products)
ALTER TABLE public.gif_sections
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- 2. ADMIN DELETE POLICY FOR REVIEWS
-- Admins can delete any review (existing policy only allows self-delete)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'reviews'
      AND policyname = 'Admins can delete any review'
  ) THEN
    CREATE POLICY "Admins can delete any review" ON public.reviews
      FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 3. SITE-IMAGES STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies for site-images bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Anyone can view site images'
  ) THEN
    CREATE POLICY "Anyone can view site images" ON storage.objects
      FOR SELECT USING (bucket_id = 'site-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can upload site images'
  ) THEN
    CREATE POLICY "Admins can upload site images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'site-images' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can update site images'
  ) THEN
    CREATE POLICY "Admins can update site images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'site-images' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can delete site images'
  ) THEN
    CREATE POLICY "Admins can delete site images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'site-images' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 4. ADD DELETE POLICIES for about bucket (missing in original migration)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can delete about images'
  ) THEN
    CREATE POLICY "Admins can delete about images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'about' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 5. ADD UPDATE POLICIES for storage buckets (needed for upsert operations)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can update gifs'
  ) THEN
    CREATE POLICY "Admins can update gifs" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'gifs' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND policyname = 'Admins can update about images'
  ) THEN
    CREATE POLICY "Admins can update about images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'about' AND
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 6. NEW SITE CONTENT KEYS for images
INSERT INTO public.site_content (key, value, section)
VALUES
  ('site_logo_url', '/logo.png', 'images'),
  ('promo_image_url', '', 'images')
ON CONFLICT (key) DO NOTHING;
