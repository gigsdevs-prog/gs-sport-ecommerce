// ============================================
// GS SPORT - Homepage (Server Component)
// ============================================

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import HeroSection from '@/components/home/HeroSection';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import type { Banner, Category, Product } from '@/types';

const ThreeDWelcome = dynamic(() => import('@/components/welcome/ThreeDWelcome'), {
  ssr: false,
  loading: () => null,
});

function SectionSkeleton() {
  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-neutral-100 rounded w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-neutral-100 rounded w-64 mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

const PromoBanner = dynamic(() => import('@/components/home/PromoBanner'), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});

async function safeQuery<T>(
  query: PromiseLike<{ data: T | null; error: unknown }>,
  timeoutMs = 8000
): Promise<T | null> {
  try {
    const result = await Promise.race([
      query,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Query timed out')), timeoutMs)
      ),
    ]);
    if (result.error) {
      console.error('Query error:', result.error);
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  // Single parallel fetch for ALL homepage data — eliminates client-side waterfall
  const [banners, categories, featured, bestSellers, categoryProducts] = await Promise.all([
    safeQuery<Banner[]>(
      supabase.from('banners').select('*').eq('active', true).order('sort_order', { ascending: true })
    ),
    safeQuery<Category[]>(
      supabase.from('categories').select('*').eq('active', true).order('name')
    ),
    safeQuery<Product[]>(
      supabase.from('products').select('*').eq('featured', true).eq('active', true)
        .order('created_at', { ascending: false }).limit(8)
    ),
    safeQuery<Product[]>(
      supabase.from('products').select('*').eq('best_seller', true).eq('active', true)
        .order('created_at', { ascending: false }).limit(4)
    ),
    safeQuery<{ category_id: string; images: string[] }[]>(
      supabase.from('products').select('category_id, images').eq('active', true)
        .order('best_seller', { ascending: false }).limit(100)
    ),
  ]);

  // Build category image map from product data (no extra queries needed)
  const categoryImages: Record<string, string> = {};
  if (categoryProducts) {
    for (const product of categoryProducts) {
      if (product.category_id && product.images?.length > 0 && !categoryImages[product.category_id]) {
        categoryImages[product.category_id] = product.images[0];
      }
    }
  }

  return (
    <>
      <ThreeDWelcome />
      <HeroSection banners={banners || []} />
      <CategoriesGrid categories={categories || []} categoryImages={categoryImages} />
      <FeaturedProducts products={featured || []} />
      <Suspense fallback={<SectionSkeleton />}>
        <PromoBanner />
      </Suspense>
      <BestSellers products={bestSellers || []} />
      <Suspense fallback={<SectionSkeleton />}>
        <Newsletter />
      </Suspense>
    </>
  );
}
