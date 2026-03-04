-- ============================================
-- GS SPORT - Migration: GIF Sections + About Page + Content Updates
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. GIF SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.gif_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  gif_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gif_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GIF sections are viewable by everyone" ON public.gif_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gif sections" ON public.gif_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_gif_sections_active ON public.gif_sections(active) WHERE active = true;

-- 2. ABOUT PAGE TABLE
CREATE TABLE IF NOT EXISTS public.about_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT,
  title TEXT NOT NULL DEFAULT 'About Us',
  description TEXT NOT NULL DEFAULT '',
  phone TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "About page is viewable by everyone" ON public.about_page
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage about page" ON public.about_page
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed default about page row
INSERT INTO public.about_page (title, description)
VALUES ('About GS SPORT', 'GS SPORT is a premium athletic brand dedicated to empowering athletes with high-quality, stylish performance wear. We believe that every athlete deserves gear that performs as hard as they do.')
ON CONFLICT DO NOTHING;

-- 3. TRIGGERS for updated_at
CREATE OR REPLACE TRIGGER set_updated_at_gif_sections
  BEFORE UPDATE ON public.gif_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_about_page
  BEFORE UPDATE ON public.about_page
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('gifs', 'gifs', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('about', 'about', true) ON CONFLICT DO NOTHING;

-- 5. STORAGE POLICIES
CREATE POLICY "Anyone can view gifs" ON storage.objects
  FOR SELECT USING (bucket_id = 'gifs');

CREATE POLICY "Admins can upload gifs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gifs' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete gifs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gifs' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can view about images" ON storage.objects
  FOR SELECT USING (bucket_id = 'about');

CREATE POLICY "Admins can upload about images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'about' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. NEW SITE CONTENT KEYS
INSERT INTO public.site_content (key, value) VALUES
  ('top_bar_text', 'Free shipping on orders over $100'),
  ('top_bar_right', 'Premium Athletic Wear'),
  ('categories_title', 'Shop by Category'),
  ('categories_subtitle', 'Find your perfect fit'),
  ('gif_section_title', 'Explore Collections'),
  ('gif_section_subtitle', 'Discover our curated selections'),
  ('product_details_title', 'Product Details'),
  ('add_to_cart_text', 'Add to Cart'),
  ('footer_copyright', 'All rights reserved.')
ON CONFLICT (key) DO NOTHING;
