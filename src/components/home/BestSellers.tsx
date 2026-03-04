// ============================================
// GS SPORT - Best Sellers Section
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductSlider from '@/components/product/ProductSlider';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useSiteContent } from '@/hooks/useSiteContent';
import type { Product } from '@/types';

const supabase = createClient();

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useSiteContent();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('best_seller', true)
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(4);
        if (error) console.error('Failed to fetch best sellers:', error);
        if (mounted.current && data) setProducts(data);
      } catch (err) {
        console.error('Best sellers fetch error:', err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    fetchProducts();

    // Realtime: re-fetch when admin changes products
    const channel = supabase
      .channel('bestsellers_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        if (mounted.current) fetchProducts();
      })
      .subscribe();

    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={getText('bestseller_title')}
          subtitle={getText('bestseller_subtitle')}
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
