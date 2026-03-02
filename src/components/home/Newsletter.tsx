// ============================================
// GS SPORT - Newsletter Section
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';
import ScrollReveal from '@/components/ui/ScrollReveal';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const { getText } = useSiteContent();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Thank you for subscribing!');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl lg:text-4xl font-light tracking-wide text-neutral-900">
              {getText('newsletter_title')}
            </h2>
            <p className="mt-4 text-sm text-neutral-500 tracking-wide">
              {getText('newsletter_subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-4 bg-white border border-neutral-200 text-sm outline-none focus:border-black transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>

            <p className="mt-4 text-xs text-neutral-400">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
