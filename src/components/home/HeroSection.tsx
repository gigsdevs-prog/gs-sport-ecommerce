// ============================================
// GS SPORT - Hero Section
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';
import { createClient } from '@/lib/supabase/client';
import type { Banner } from '@/types';

const supabase = createClient();

export default function HeroSection() {
  const { getText } = useSiteContent();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true });
        if (error) console.error('Failed to fetch banners:', error);
        if (mounted.current && data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error('Banner fetch error:', err);
      }
    };
    fetchBanners();

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <>
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-neutral-100">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {banners.length > 0 && banners[currentBanner] ? (
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {banners[currentBanner].image_url?.endsWith('.gif') ? (
              <img
                src={banners[currentBanner].image_url}
                alt={banners[currentBanner].title || 'Banner'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={banners[currentBanner].image_url}
                alt={banners[currentBanner].title || 'Banner'}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={95}
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs tracking-[0.3em] uppercase text-white/80 mb-4 font-medium"
            >
              GS SPORT
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] ${
                banners.length > 0 ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {getText('hero_headline')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg ${
                banners.length > 0 ? 'text-white/80' : 'text-neutral-600'
              } max-w-md leading-relaxed`}
            >
              {getText('hero_subheadline')}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Banner dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentBanner ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>

    {/* Shop Now Button — below the banner */}
    <div className="flex justify-center py-6 bg-white">
      <Link
        href="/shop"
        className="inline-block bg-black text-white px-8 sm:px-12 py-3 sm:py-4 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium border border-black hover:bg-white hover:text-black transition-all duration-500"
      >
        {getText('hero_cta')}
      </Link>
    </div>
    </>
  );
}
