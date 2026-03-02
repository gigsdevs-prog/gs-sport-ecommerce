// ============================================
// GS SPORT - Featured Products Section
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useSiteContent } from '@/hooks/useSiteContent';
import type { Product } from '@/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useSiteContent();
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={getText('featured_title')}
          subtitle={getText('featured_subtitle')}
        />

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
