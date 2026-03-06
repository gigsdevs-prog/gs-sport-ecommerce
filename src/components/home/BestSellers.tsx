// ============================================
// GS SPORT - Best Sellers Section
// ============================================

'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import ProductSlider from '@/components/product/ProductSlider';
import { useLanguage } from '@/hooks/useLanguage';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('bestseller_title')}
          subtitle={t('bestseller_subtitle')}
        />
        <ProductSlider products={products} />
      </div>
    </section>
  );
}
