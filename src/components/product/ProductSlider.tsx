// ============================================
// GS SPORT - Product Slider / Carousel (Swiper)
// ============================================

'use client';

import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

import 'swiper/css';
import 'swiper/css/free-mode';

interface ProductSliderProps {
  products: Product[];
  title?: string;
}

const ProductSlider = memo(function ProductSlider({ products }: ProductSliderProps) {
  if (products.length === 0) return null;

  return (
    <div className="product-slider -mx-4 px-4 sm:-mx-0 sm:px-0">
      <Swiper
        modules={[FreeMode]}
        freeMode={{ enabled: true, sticky: false, momentumRatio: 0.5 }}
        slidesPerView={1.5}
        spaceBetween={16}
        grabCursor
        breakpoints={{
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default ProductSlider;
