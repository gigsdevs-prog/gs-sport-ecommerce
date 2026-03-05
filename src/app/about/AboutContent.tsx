// ============================================
// GS SPORT - About Us Content (Client Component)
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';
import type { AboutPage } from '@/types';

const supabase = createClient();

// Social media icon components
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export default function AboutContent() {
  const [about, setAbout] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase
        .from('about_page')
        .select('*')
        .limit(1)
        .single();

      if (data) setAbout(data);
      setLoading(false);
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-neutral-500">{t('about_not_available')}</p>
      </div>
    );
  }

  const socialLinks = [
    { url: about.instagram_url, icon: InstagramIcon, label: 'Instagram' },
    { url: about.facebook_url, icon: FacebookIcon, label: 'Facebook' },
    { url: about.tiktok_url, icon: TikTokIcon, label: 'TikTok' },
  ].filter(s => s.url && s.url.trim() !== '');

  return (
    <section className="py-16 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left side - Image */}
          <motion.div variants={fadeInLeft} className="relative">
            {about.image_url ? (
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
                <Image
                  src={about.image_url}
                  alt={about.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
                {/* Subtle decorative border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <span className="text-6xl font-bold tracking-[0.3em] text-neutral-300">GS</span>
              </div>
            )}
          </motion.div>

          {/* Right side - Content */}
          <motion.div variants={fadeInRight}>
            <motion.p
              variants={fadeInUp}
              className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4 font-medium"
            >
              {t('our_story')}
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 leading-tight"
            >
              {about.title}
            </motion.h1>
            <motion.div
              variants={fadeInUp}
              className="mt-6 text-neutral-600 leading-relaxed text-base lg:text-lg whitespace-pre-line"
            >
              {about.description}
            </motion.div>

            {/* Contact & Social */}
            <motion.div variants={fadeInUp} className="mt-10 space-y-6">
              {/* Phone */}
              {about.phone && (
                <a
                  href={`tel:${about.phone}`}
                  className="inline-flex items-center gap-3 text-neutral-700 hover:text-black transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm font-medium tracking-wide">{about.phone}</span>
                </a>
              )}

              {/* Social media icons */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label={label}
                    >
                      <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                        <Icon className="w-5 h-5" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
