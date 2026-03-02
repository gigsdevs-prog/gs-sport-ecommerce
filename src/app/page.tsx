// ============================================
// GS SPORT - Homepage
// ============================================

import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';

const CategoriesGrid = dynamic(() => import('@/components/home/CategoriesGrid'));
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'));
const BestSellers = dynamic(() => import('@/components/home/BestSellers'));
const PromoBanner = dynamic(() => import('@/components/home/PromoBanner'));
const Newsletter = dynamic(() => import('@/components/home/Newsletter'));

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <PromoBanner />
      <BestSellers />
      <Newsletter />
    </>
  );
}
