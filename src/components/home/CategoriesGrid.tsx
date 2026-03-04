// ============================================
// GS SPORT - Categories Grid (with best-seller images & animations)
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/ui/SectionHeading';
import { useSiteContent } from '@/hooks/useSiteContent';
import type { Category } from '@/types';

const fallbackCategories = [
  { name: 'Men', slug: 'men', image: null },
  { name: 'Women', slug: 'women', image: null },
  { name: 'Accessories', slug: 'accessories', image: null },
  { name: 'Shoes', slug: 'shoes', image: null },
];

const supabase = createClient();

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellerImages, setBestSellerImages] = useState<Record<string, string>>({});
  const { getText } = useSiteContent();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('name');
        if (catError) console.error('Failed to fetch categories:', catError);

        if (mounted.current && catData && catData.length > 0) {
          setCategories(catData);

          // For each category, find the best-selling product image
          // Best-seller = most ordered product, or flagged best_seller
          const imageMap: Record<string, string> = {};

          // First try: get best_seller flagged products per category
          const { data: bestSellers } = await supabase
            .from('products')
            .select('category_id, images')
            .eq('best_seller', true)
            .eq('active', true)
            .order('created_at', { ascending: false });

          if (bestSellers) {
            for (const product of bestSellers) {
              if (product.category_id && product.images?.length > 0 && !imageMap[product.category_id]) {
                imageMap[product.category_id] = product.images[0];
              }
            }
          }

          // Fallback: for categories without a best-seller, get latest active product
          const missingCategoryIds = catData
            .filter(c => !imageMap[c.id])
            .map(c => c.id);

          if (missingCategoryIds.length > 0) {
            const { data: fallbackProducts } = await supabase
              .from('products')
              .select('category_id, images')
              .in('category_id', missingCategoryIds)
              .eq('active', true)
              .order('created_at', { ascending: false });

            if (fallbackProducts) {
              for (const product of fallbackProducts) {
                if (product.category_id && product.images?.length > 0 && !imageMap[product.category_id]) {
                  imageMap[product.category_id] = product.images[0];
                }
              }
            }
          }

          if (mounted.current) setBestSellerImages(imageMap);
        }
      } catch (err) {
        console.error('Categories fetch error:', err);
      }
    };

    fetchData();

    return () => {
      mounted.current = false;
    };
  }, []);

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={getText('categories_title')}
          subtitle={getText('categories_subtitle')}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {displayCategories.map((category) => {
            const catId = 'id' in category ? (category as Category).id : '';
            const bestSellerImg = catId ? bestSellerImages[catId] : null;
            const displayImage = bestSellerImg || category.image;

            return (
              <motion.div key={category.slug} variants={cardVariants}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
                >
                  {/* Background image with scale-on-hover */}
                  {displayImage ? (
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Image
                        src={displayImage}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                        quality={85}
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center transition-all duration-700 group-hover:from-neutral-200 group-hover:to-neutral-300">
                      <span className="text-6xl font-light text-neutral-300 group-hover:text-neutral-400 transition-colors duration-500">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Smooth background overlay transition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Fade-in text + slide-up button */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col items-center">
                    {/* Category name with fade-in */}
                    <motion.span
                      className="text-white text-sm sm:text-base tracking-[0.2em] uppercase font-medium mb-2 drop-shadow-lg"
                      initial={{ opacity: 0.9 }}
                      whileInView={{ opacity: 1 }}
                    >
                      {category.name}
                    </motion.span>

                    {/* Button that slides up on hover */}
                    <div className="overflow-hidden w-full">
                      <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 text-center rounded flex items-center justify-center gap-2">
                          <span className="text-xs tracking-[0.15em] uppercase font-medium text-neutral-800">
                            Shop Now
                          </span>
                          <ArrowRight size={14} className="text-neutral-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
