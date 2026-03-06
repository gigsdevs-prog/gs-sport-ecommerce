// ============================================
// GS SPORT - Featured Products Section
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductSlider from '@/components/product/ProductSlider';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/hooks/useLanguage';
import { withTimeout } from '@/utils';
import type { Product } from '@/types';

const supabase = createClient();

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetchProducts = async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('products')
            .select('*')
            .eq('featured', true)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(8),
          8000
        );
        if (error) console.error('Failed to fetch featured products:', error);
        if (mounted.current && data) setProducts(data);
      } catch (err) {
        console.error('Featured products fetch error:', err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    fetchProducts();

    return () => {
      mounted.current = false;
    };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('featured_title')}
          subtitle={t('featured_subtitle')}
        />

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <ProductSlider products={products} />
        )}
      </div>
    </section>
  );
}
