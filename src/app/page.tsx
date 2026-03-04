// ============================================
// GS SPORT - Homepage
// ============================================

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';

const ThreeDWelcome = dynamic(() => import('@/components/welcome/ThreeDWelcome'), {
  ssr: false,
  loading: () => null,
});
const CategoriesGrid = dynamic(() => import('@/components/home/CategoriesGrid'), {
  loading: () => <SectionSkeleton />,
});
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), {
  loading: () => <SectionSkeleton />,
});
const BestSellers = dynamic(() => import('@/components/home/BestSellers'), {
  loading: () => <SectionSkeleton />,
});
const PromoBanner = dynamic(() => import('@/components/home/PromoBanner'), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  loading: () => <SectionSkeleton />,
  ssr: false,
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

export default function HomePage() {
  return (
    <>
      <ThreeDWelcome />
      <HeroSection />
      <Suspense fallback={<SectionSkeleton />}>
        <CategoriesGrid />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <PromoBanner />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BestSellers />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Newsletter />
      </Suspense>
    </>
  );
}
