// ============================================
// GS SPORT - Categories Grid
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Category } from '@/types';

const fallbackCategories = [
  { name: 'Men', slug: 'men', image: null },
  { name: 'Women', slug: 'women', image: null },
  { name: 'Accessories', slug: 'accessories', image: null },
  { name: 'Shoes', slug: 'shoes', image: null },
];

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');
      if (data && data.length > 0) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, [supabase]);

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Shop by Category"
          subtitle="Find your perfect fit"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {displayCategories.map((category) => (
            <motion.div key={category.slug} variants={fadeInUp}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <span className="text-6xl font-light text-neutral-300">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 text-center rounded">
                    <span className="text-sm tracking-[0.2em] uppercase font-medium">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
