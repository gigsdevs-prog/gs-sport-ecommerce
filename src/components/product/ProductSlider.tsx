// ============================================
// GS SPORT - Product Slider / Carousel
// ============================================

'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductSliderProps {
  products: Product[];
  title?: string;
}

const ProductSlider = memo(function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(':scope > div')?.clientWidth || 280;
    const gap = 16;
    const amount = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group/slider">
      {/* Left Arrow */}
      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll('left')}
          className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 lg:opacity-70 lg:hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </motion.button>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 sm:-mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-[30vw] lg:w-[23%] snap-start"
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll('right')}
          className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 lg:opacity-70 lg:hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </motion.button>
      )}
    </div>
  );
});

export default ProductSlider;
