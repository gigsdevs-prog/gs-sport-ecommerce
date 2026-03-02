// ============================================
// GS SPORT - Promotional Banner Section
// ============================================

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function PromoBanner() {
  const { getText } = useSiteContent();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-lg bg-neutral-900 py-20 lg:py-28 px-8 lg:px-16 text-center">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4"
              >
                Limited Time Offer
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-5xl font-light text-white tracking-tight"
              >
                {getText('promo_title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-neutral-400 text-base lg:text-lg"
              >
                {getText('promo_subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Link
                  href="/shop"
                  className="inline-block bg-white text-black px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-neutral-200 transition-colors duration-300"
                >
                  {getText('promo_cta')}
                </Link>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
