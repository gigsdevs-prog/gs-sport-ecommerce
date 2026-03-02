// ============================================
// GS SPORT - Best Sellers Section
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useSiteContent } from '@/hooks/useSiteContent';
import type { Product } from '@/types';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useSiteContent();
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('best_seller', true)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
