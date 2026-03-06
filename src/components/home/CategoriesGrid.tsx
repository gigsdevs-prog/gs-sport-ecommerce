// ============================================
// GS SPORT - Categories Slider (Swiper with admin images)
// ============================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { Category } from '@/types';

import 'swiper/css';
import 'swiper/css/free-mode';

interface CategoriesGridProps {
  categories: Category[];
  categoryImages: Record<string, string>;
}

export default function CategoriesGrid({ categories, categoryImages }: CategoriesGridProps) {
  const { t } = useLanguage();

  const fallbackCategories: { name: string; slug: string; image: string | null }[] = [
    { name: t('category_men'), slug: 'men', image: null },
    { name: t('category_women'), slug: 'women', image: null },
    { name: t('category_accessories'), slug: 'accessories', image: null },
    { name: t('category_shoes'), slug: 'shoes', image: null },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('shop_by_category')}
          subtitle={t('find_your_fit')}
        />

        <Swiper
          modules={[FreeMode]}
          freeMode={{ enabled: true, sticky: false, momentumRatio: 0.5 }}
          slidesPerView={1.4}
          spaceBetween={16}
          grabCursor
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {displayCategories.map((category) => {
            const catId = 'id' in category ? (category as Category).id : '';
            const bestSellerImg = catId ? categoryImages[catId] : null;
            const displayImage = bestSellerImg || category.image;

            return (
              <SwiperSlide key={category.slug}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
                >
                  {displayImage ? (
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.08]">
                      <Image
                        src={displayImage}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 70vw, 25vw"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center transition-all duration-700 group-hover:from-neutral-200 group-hover:to-neutral-300">
                      <span className="text-6xl font-light text-neutral-300 group-hover:text-neutral-400 transition-colors duration-500">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col items-center">
                    <span className="text-white text-sm sm:text-base tracking-[0.2em] uppercase font-medium mb-2 drop-shadow-lg">
                      {category.name}
                    </span>

                    <div className="overflow-hidden w-full">
                      <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 text-center rounded flex items-center justify-center gap-2">
                          <span className="text-xs tracking-[0.15em] uppercase font-medium text-neutral-800">
                            {t('shop_now')}
                          </span>
                          <ArrowRight size={14} className="text-neutral-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
